import {myCompare,myHash,exeption , encryption ,createTokens, RoleEnum, providerEnum ,sendEmail, emailEnum }from "../../common/index.js"
import { ur,mr } from "../../DB/repo/index.js"
import configService from "../../config/config.service.js"
import {OAuth2Client} from  'google-auth-library';
import { randomInt } from 'crypto'


 


export const signUp = async (data)=>{
    let exists = await ur.findOne({ filter: { email: data.email } })
    if (exists) exeption.conflict({ message: "user already exists" })
        data.password = await myHash ({plainText:data.password})
    data.phone = await encryption(data.phone)

    

        return await ur.create({ data: { ...data, role: RoleEnum.user } })
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
   let user = await ur.findOne({ filter: { email } })
   if(!user){
    exeption.badRequest({message:"user not found"})
   }
    let userId = user._id
   
  
   
    let message = await mr.findOne({filter:{userId}})
    if(!message || message.otp !== otp)
    {
        exeption.badRequest({message:"wrong or expired otp try again"})
    }
    await ur.updateOne({
        filter :{_id:userId},
        update:{isVerified:emailEnum.verified}
    })
    await mr.deleteOne({ filter: { _id: message._id } })
    return user
}

export const generateOtp = async (email) => {
    let user = await ur.findOne({ filter: { email } });

    if (!user) {
        return exeption.notFound({ message: "no user found" });
    }

    const userId = user._id;

    const deleteResult = await mr.deleteMany({
       filter: { userId: userId }
    });
    console.log("Deleted Count:", deleteResult);

   
    let messageRecord = await mr.create({
        data: {
            otp: randomInt(100000, 999999).toString(),
            userId: userId
        }
    });

    try {
        await sendEmail({
          to: email,
          subject: "Confirm your email",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2>Welcome</h2>
              <p>Please use the verification code below to confirm your email. This code is valid for 5 minutes:</p>
              <div style="background: #f4f4f4; padding: 10px 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px; display: inline-block; margin: 10px 0;">
                ${messageRecord.otp}
              </div>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          `,
        });
        console.log("email sent");
    } catch(err) {
        
        exeption.badRequest({ message: "Failed to send confirmation email please try again" });
    }

    return "otp sent";
};