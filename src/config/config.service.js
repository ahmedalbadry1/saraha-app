import { config } from "dotenv"
import { resolve } from "path"

config({

    path: resolve(`.env.${process.env.NODE_ENV}`)
})

export default {
    port: Number(process.env.port),
    DB_url: process.env.DB_url,
    SALT: Number(process.env.SALT),
    ENC_KEY: process.env.ENC_KEY,
    ENC_IV_LENGTH: Number(process.env.ENC_IV_LENGTH),
    ENC_ALGO: process.env.ENC_ALGO,
    JWT_ACCESS_ADMIN_SECRET: process.env.JWT_ACCESS_ADMIN_SECRET,
    JWT_ACCESS_USER_SECRET: process.env.JWT_ACCESS_USER_SECRET,
    JWT_REFRESH_ADMIN_SECRET: process.env.JWT_REFRESH_ADMIN_SECRET,
    JWT_REFRESH_USER_SECRET: process.env.JWT_REFRESH_USER_SECRET,
    JWT_ACCESS_EXP: Number(process.env.JWT_ACCESS_EXP),
    JWT_REFRESH_EXP: process.env.JWT_REFRESH_EXP,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    GMAIL_PASS: process.env.GMAIL_PASS,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    REDIS_URL: process.env.REDIS_URL
}

