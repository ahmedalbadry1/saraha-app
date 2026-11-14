import {config} from "dotenv"
import {resolve} from "path"

config({

    path:resolve(`.env.${process.env.NODE_ENV}`)
})

export let port =Number( process.env.port)
export let DB_url = process.env.DB_url
export let SALT =Number(process.env.SALT)
export let ENC_KEY =process.env.ENC_KEY
export let ENC_IV_LENGTH =Number(process.env.ENC_IV_LENGTH) 
export let ENC_ALGO =process.env.ENC_ALGO
export let JWT_ACCESS_ADMIN_SECRET =process.env.JWT_ACCESS_ADMIN_SECRET
export let JWT_ACCESS_USER_SECRET =process.env.JWT_ACCESS_USER_SECRET
export let JWT_REFRESH_ADMIN_SECRET =process.env.JWT_REFRESH_ADMIN_SECRET
export let JWT_REFRESH_USER_SECRET =process.env.JWT_REFRESH_USER_SECRET
export let JWT_ACCESS_EXP =Number(process.env.JWT_ACCESS_EXP)
export let JWT_REFRESH_EXP =process.env.JWT_REFRESH_EXP
