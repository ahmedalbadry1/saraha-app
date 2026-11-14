import {myCompare,myHash,exeption , encryption ,createTokens, RoleEnum  }from "../../common/index.js"
import { ur } from "../../repo/index.js"
import * as conf from "../../config/config.service.js"


export const signUp = async (data)=>{
    let exists = await ur.findUser(data.email)
    if (exists) exeption.conflict({ message: "user already exists" })
        data.password = await myHash ({plainText:data.password})
    data.phone = await encryption(data.phone)

        return await ur.createUser({...data,role:RoleEnum.user})
    }
   
   
  export const logIn = async ({email , password })=>{
    
    let user = await ur.findUser(email)
    
           
     if(!user) exeption.notFound({ message: "user not found" })
                
     let match = await myCompare ({
                    plainText:password,
                    hashed:user.password
                })

                if(!match) exeption.notFound({ message: "user not found" })

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
    let expIn = conf.JWT_ACCESS_EXP

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
