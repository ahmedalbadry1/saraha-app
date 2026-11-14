import jwt from "jsonwebtoken"
import { RoleEnum, tokenTypeEnum } from ".././/index.js"
import * as configService from "../../config/config.service.js"

const getRoleSecret = (role)=>{
    let secrets
     switch (role) {
        case RoleEnum.admin:
            secrets = {
                access: configService.JWT_ACCESS_ADMIN_SECRET,
                refresh: configService.JWT_REFRESH_ADMIN_SECRET
            }
            break
        default:
            secrets = {
                access: configService.JWT_ACCESS_USER_SECRET,
                refresh: configService.JWT_REFRESH_USER_SECRET
            }
            break
    }
    return secrets
}



const getSecret = ({tokenType=tokenTypeEnum.access ,role =RoleEnum.user})=>{

    let secret = getRoleSecret(role)
      return tokenType == tokenTypeEnum.refresh ? secret.refresh : secret.access

}


 const createToken = ({payload = {},options={}, secret = configService.JWT_SECRET})=>{

    return jwt.sign(payload,secret,options)

}

export const createTokens =({payload = {},options={}, role =RoleEnum.user})=>{

    let secrets = getRoleSecret(role)
    let accessToken= createToken({
        payload,
        role,
        options:{...options,expiresIn:configService.JWT_ACCESS_EXP},
        secret:secrets.access
    })
     let refreshToken = createToken({
        role,
        payload,
        options: { ...options, expiresIn: configService.JWT_REFRESH_EXP },
        secret: secrets.refresh
    })
    return { accessToken, refreshToken }

}

export const verifyToken = ({token ,tokenType=tokenTypeEnum.access}) =>{
    let {role}= jwt.decode(token)
    return jwt.verify(token,getSecret({tokenType,role}))
}
