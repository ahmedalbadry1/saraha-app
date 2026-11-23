import { myCompare, myHash, exeption, encryption, createTokens, RoleEnum, providerEnum, cs, subjectEnum,emailEnum, logoutEnum, emailEvent, key } from "../../common/index.js"
import { ur } from "../../DB/repo/index.js"
import configService from "../../config/config.service.js"
import { OAuth2Client } from 'google-auth-library';
import { randomInt } from 'crypto'

const cheackUserExestance = async(filter)=>{


    let user = await ur.findOne({ filter })

    if (!user) exeption.NotFound("user not found")

        return user

}

const revokeTokens = async (payload) => {
    const { exp, jti, sub } = payload;

    const nowInSec = Math.ceil(Date.now() / 1000);
    const ttl = exp - nowInSec;

    await cs.set({
        key: key.userRevokeKey({ userId: sub, jti }),
        value: jti,
        ttl
    });

    return { ...payload, nowInSec, ttl };
};

const checkUserBlocked = async ({ userId, subject, messagePrefix }) => {
    const currentBlockTtl = await cs.ttl({ key: key.userBlockKey({ userId, subject }) });
    if (currentBlockTtl > 0) {
        const remainingMinutes = Math.ceil(currentBlockTtl / 60);
        throw exeption.TooManyRequests(
            `${messagePrefix} Please try again after ${remainingMinutes} minute(s).`
        );
    }
};

const createAndSendOTP = async ({ user, subject, ttl = 100, blockTtl = 900, maxTrails = 5 ,trailTtl=300}) => {
    
    let userId = user._id
    
    await checkUserBlocked({ userId, subject, messagePrefix: "You are temporarily blocked" })

    const trailsKey = key.userOtpTrailsKey({ userId, subject });
    const blockKey = key.userBlockKey({ userId, subject });

    const trails = Number((await cs.get({ key: trailsKey ,ttl:trailTtl})) || 0)
    const existingOtp = await cs.get({ key:key.userSubjectedOtpKey({userId,subject}) });
    if (existingOtp) {
        exeption.BadRequest("Old OTP is still valid. Please check your email.");
    }
    if (trails >= maxTrails) {
        await cs.set({ key: blockKey, value: 1, ttl: blockTtl })
        const remainingMinutes = Math.ceil(blockTtl / 60);
        exeption.TooManyRequests(`Too many requests. Please try again after ${remainingMinutes} minute(s).`)
    }
    const otp = randomInt(100000, 999999).toString();
    await cs.set({
        key: key.userSubjectedOtpKey({ userId, subject }),
        value: otp,
        ttl: ttl,
    })

    emailEvent.emit(subject, {
        email: user.email,
        otp,
    });

    await cs.incrBy({ key: trailsKey, increment: 1 })

};

const verifyOTP = async ({ userId, subject, otp, ttl = 900, maxtrails = 5 }) => {
    await checkUserBlocked({ userId, subject, messagePrefix: "You are temporarily blocked." })

    const otpKey = key.userSubjectedOtpKey({ userId, subject });
    
    const storedOtp = await cs.get({ key: otpKey });
    
    if (!storedOtp) {
        exeption.BadRequest("OTP expired or not requested");
    }

    if (String(storedOtp).trim() !== String(otp).trim()) {
        const wrongTrialsKey = key.userWrongOtpTrailsKey({ userId, subject });
        const trials = await cs.incrBy({ key: wrongTrialsKey, increment: 1 });

        if (trials >= maxtrails) {
            const blockKey = key.userBlockKey({ userId, subject });
            await cs.set({ key: blockKey, value: "blocked", ttl });
            await cs.del({ keys: wrongTrialsKey });
            exeption.TooManyRequests("Too many failed attempts. You have been blocked for 15 minutes.");
        }

        exeption.BadRequest(`Invalid OTP. You have ${5 - trials} attempt(s) remaining.`);
    }

    return true;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const signUp = async (data) => {
    let exists = await ur.findOne({ filter: { email: data.email } })
    if (exists) exeption.Conflict("user already exists")
    data.password = await myHash({ plainText: data.password })
    data.phone = await encryption(data.phone)

    let user = await ur.create({ data: { ...data, role: RoleEnum.user } })
  
    await createAndSendOTP({user,subject:subjectEnum.signup,maxTrails:1,})
    

    return user
}


export const logIn = async ({ email, password }) => {

    let user = await cheackUserExestance({ email })

    let match = await myCompare({
        plainText: password,
        hashed: user.password
    })

    if (!match) exeption.NotFound("user not found")

    if (user.isVerified !== emailEnum.verified) {
        exeption.Unauthorized("Please verify your email first")
    }

    let tokens = createTokens({
        payload: { role: user.role },
        options: {
            subject: user.id,
            issuer: "AHMED",
            audience: ["admin", "user"]
        },
        role: user.role
    })

    return tokens
}

export const rotateToken = async ({ user, payload }) => {

    let IAT = payload.iat
    let expIn = configService.JWT_ACCESS_EXP

    let expAt = (IAT + expIn) * 1000

    let currTime = Date.now()

    if (currTime < expAt) {
        exeption.Conflict("access token still valid");
    }

    let { accessToken } = createTokens({
        payload: { role: user.role },
        options: {
            subject: user.id,
            issuer: "AHMED",
            audience: ["admin", "user"]
        },
        role: user.role
    });

    await revokeTokens(payload)

    return { accessToken };

}

export const loginWithGoogle = async ({ idToken, issuer }) => {

    const payload = await verifyGoogleId(idToken)
    let { email, picture, name } = payload

    let user = await ur.findOne({ filter: { email } })
    let Status = 200
    if (!user) {
        user = await ur.create({
            data: {
                email,
                userName: name,
                image: picture,
                provider: providerEnum.google
            }
        })


        Status = 201

    }

    const tokens = createTokens({
        payload: { role: user.role },
        options: {
            subject: user._id.toString(),
            issuer,
            audience: ["admin", "user"]
        },
        role: user.role
    });

    return { tokens, status: Status }

}



export const verifyGoogleId = async (idToken) => {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: configService.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload.email_verified) exeption.BadRequest("email is not verified")
    return payload
}




export const confermEmail = async ({ otp, email }) => {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await cheackUserExestance({ email: normalizedEmail });

    if (user.isVerified === emailEnum.verified) {
    exeption.Conflict("Email is already confirmed");
}

    let userId = user._id;

    await verifyOTP({ userId, subject: subjectEnum.signup, otp });

    await ur.updateOne({
        filter: { _id: user._id },
        update: { isVerified: emailEnum.verified }
    });

    await cs.deleteByPrefix({ prefix: key.userSubjectedOtpKey({ userId, subject: subjectEnum.signup }) });

    return user;
};

 

export const logOut = async ({ payload }, action = logoutEnum.device) => {

    switch (action) {
        case logoutEnum.all:
            await ur.updateOne({
                filter: { _id: payload.sub },
                update: { changeCredentialsAt: Date.now() }
            })
            await deleteByPrefix(userKeyBase({ userId: payload.sub }))
            break
        case logoutEnum.device:
        default:

            await revokeTokens(payload)
            break
    }


}


export const resendOtp =async({email,subject})=>{
let user =await cheackUserExestance({email})
    
  await createAndSendOTP({user,subject,maxTrails:5})

}

export const forgetPassword = async({email,subject})=>{

let user =await cheackUserExestance({email})
    
  await createAndSendOTP({user,subject,maxTrails:5})

    
}
export const verifyForgetPasswordOTP = async({otp,email})=>{
    const normalizedEmail = email.toLowerCase().trim();
    let user = await cheackUserExestance({ email: normalizedEmail });
    let userId = user._id;

    await verifyOTP({ userId, subject: subjectEnum.forgetPassword, otp });

    

}
export const resetPassword = async({otp,newPassword,email})=>{
    const normalizedEmail = email.toLowerCase().trim();
    let user = await cheackUserExestance({ email :normalizedEmail});
    
    let userId = user._id;

    await verifyOTP({ userId, subject: subjectEnum.forgetPassword, otp });

    await cs.deleteByPrefix({ prefix: key.userSubjectedOtpKey({ userId, subject: subjectEnum.forgetPassword }) });
   
    let password = await myHash({plainText:newPassword,})
   await ur.updateOne({filter: { _id: userId },update: { password }})


    
    
    
    
}