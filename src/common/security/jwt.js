import jwt from "jsonwebtoken"
import { RoleEnum, tokenTypeEnum, key, exeption, cs } from ".././/index.js"
import configService from "../../config/config.service.js"
import crypto from "crypto"
import { ur } from "../../DB/repo/index.js"

const getRoleSecret = (role) => {
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



const getSecret = ({ tokenType = tokenTypeEnum.access, role = RoleEnum.user }) => {

    let secret = getRoleSecret(role)
    return tokenType == tokenTypeEnum.refresh ? secret.refresh : secret.access

}


const createToken = ({ payload = {}, options = {}, secret = configService.JWT_SECRET }) => {

    return jwt.sign(payload, secret, options)

}

export const createTokens = ({ payload = {}, options = {}, role = RoleEnum.user }) => {

    let secrets = getRoleSecret(role)
    let jti = crypto.randomUUID()
    let accessToken = createToken({
        payload,
        role,
        options: { ...options, expiresIn: configService.JWT_ACCESS_EXP, jwtid: jti },
        secret: secrets.access
    })
    let refreshToken = createToken({
        role,
        payload,
        options: { ...options, expiresIn: configService.JWT_REFRESH_EXP, jwtid: jti },
        secret: secrets.refresh
    })
    return { accessToken, refreshToken }

}

export const verifyToken = async ({ token, tokenType = tokenTypeEnum.access }) => {
    let { role, sub, jti, iat } = jwt.decode(token)
    const isRevoked = await cs.get({ key: key.userRevokeKey({ userId: sub, jti }) })
    if (isRevoked) {
        exeption.Unauthorized("this token is revoked")
    }
    const user = await ur.findById({
        id: sub,
        projection: "changeCredentialsAt"
    })

    if (user?.changeCredentialsAt) {
        const changeTimestamp = Math.floor(user.changeCredentialsAt.getTime() / 1000)
        if (changeTimestamp > iat) {
            exeption.Unauthorized("this token is revoked")
        }
    }

    return jwt.verify(token, getSecret({ tokenType, role }))
}
