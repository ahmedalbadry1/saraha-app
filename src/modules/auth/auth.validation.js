import z from "zod"
import { GF, langEnum } from "../../common/index.js"
 

export const loginSchema = (lang = langEnum.en) => z.object({
    body: z.strictObject({
        email: GF.email(lang),
        password: GF.password(lang),
    })
})

export const signupSchema = (lang = langEnum.en) => z.object({
    body: z.strictObject({
        email: GF.email(lang),
        password: GF.password(lang),
        userName:z.string().min(7).includes(" "),
        gender:z.int(),
        phone:GF.phone(lang),
        role:z.number().int().optional()
    })
})

export const confirmEmailSchema = (lang = langEnum.en) => z.object({
    body: z.strictObject({
        email: GF.email(lang),
        otp: z.string().length(6)
    })
})

export const sendOtpSchema = (lang = langEnum.en) => z.object({
    body: z.strictObject({
        email: GF.email(lang)
    })
})

export const googleLoginSchema = z.object({
    body: z.strictObject({
        idToken: z.string()
    })
})









