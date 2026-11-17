import z from "zod"
 

export const loginSchema = z.strictObject({
    email:z.email({ pattern: z.regexes.email }),
    password:z.string().min(8).max(20)
})

export const signupSchema = loginSchema.extend({

    userName:z.string().min(7).includes(" "),
    gender:z.int(),
    phone:z.e164({message:"Phone must be in international format"}),
    role:z.number().int().optional()

})

export const confirmEmailSchema = z.strictObject({
    email: z.email({ pattern: z.regexes.email }),
    otp: z.string().length(6)
})

export const sendOtpSchema = z.strictObject({
    email: z.email({ pattern: z.regexes.email })
})

export const googleLoginSchema = z.strictObject({
    idToken: z.string()
})









