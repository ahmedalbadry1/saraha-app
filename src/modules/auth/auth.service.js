import {myCompare,myHash,exeption , encryption ,createTokens, RoleEnum, providerEnum ,cs,sendEmail,emailEnum,emailEvent }from "../../common/index.js"
import { ur} from "../../DB/repo/index.js"
import configService from "../../config/config.service.js"
import {OAuth2Client} from  'google-auth-library';
import { randomInt } from 'crypto'




export const signUp = async (data)=>{
    let exists = await ur.findOne({ filter: { email: data.email } })
    if (exists) exeption.conflict({ message: "user already exists" })
        data.password = await myHash ({plainText:data.password})
    data.phone = await encryption(data.phone)

    let user= await ur.create({ data: { ...data, role: RoleEnum.user } })
    const otp = await generateOtp({
    userId: user._id,
    type: "signup",
  });

  emailEvent.emit("signup", {
    email: user.email,
    otp,
  });
    

        return user
    }
   
   
  export const logIn = async ({email , password })=>{
    
    let user = await ur.findOne({ filter: { email } })
    
           
     if(!user) exeption.notFound({ message: "user not found" })
                
     let match = await myCompare ({
                    plainText:password,
                    hashed:user.password
                })

                if(!match) exeption.notFound({ message: "user not found" })

                if (user.isVerified !== emailEnum.verified) {
                    exeption.unauthorized({ message: "Please verify your email first" })
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

export const rotateToken =async({user ,payload})=>{

    let IAT =payload.iat
    let expIn = configService.JWT_ACCESS_EXP

    let expAt = (IAT+expIn) *1000

    let currTime = Date.now()

     if (currTime < expAt) {
        exeption.conflict({
            message: "access token still valid"
        });
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

    return { accessToken };

}    

export const loginWithGoogle =async({idToken,issuer})=>{
    
    const payload = await verifyGoogleId(idToken)
    let {email,picture,name}=payload

    let user = await ur.findOne({ filter: { email } })
let Status = 200
    if(!user)
    {
       user = await ur.create({
    data: {
        email,
        userName: name, 
        image: picture,
        provider: providerEnum.google
    }
})
      

      Status=201

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
    
    return {tokens,status:Status}

}



export const verifyGoogleId=async(idToken)=> {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: configService.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified) exeption.badRequest({message:"email is not verified"})
  return payload
}


export const confermEmail = async({otp, email})=>{
   const normalizedEmail = email.toLowerCase().trim();
   let user = await ur.findOne({ filter: { email: normalizedEmail } })
   if(!user){
    exeption.notFound({message:"user not found"})
   }
   
    
   
    const key = `otp:signup:${user._id}`;
  const storedOtp = await cs.get({ key });
  
  console.log({
  emailArg: email,
  otpArg: otp,
  userId: user?._id?.toString(),
  key,
  storedOtp,
}); 

    if (!storedOtp || String(storedOtp).trim() !== String(otp).trim()) {
    return exeption.badRequest({ message: "Invalid OTP" });
  }
    await ur.updateOne({
        filter :{_id:user._id},
        update:{isVerified:emailEnum.verified}
    })
    await cs.del({ keys: key })
    return user
}

export const generateOtp = async ({userId,type="signup",ttl=300}) => {
 
    const otp = randomInt(100000, 999999).toString();
    await cs.set({
        key: `otp:${type}:${userId}`,
    value: otp,
    ttl: ttl,
    })

    return otp;
};