import mongoose from "mongoose"
import z from "zod"
import { GF, langEnum } from "../../common/index.js"

export const getUserByIdSchema = (lang = langEnum.en) => z.object({
    params: z.strictObject({
        id: GF.id(lang)
    }).refine((data) => {
        return mongoose.isValidObjectId(data.id)
    }, {
        message: "invalid objectId",
        path: ["params", "id"]
    })
})

export const paginationSchema = (lang = langEnum.en) => z.object({
    headers: z.strictObject({
        lang: GF.string(lang),
    }),
    query: z.strictObject({
        phone: GF.string(lang).optional()
    })
})

export const updateSchema = (lang = langEnum.en) => z.object({
    params: z.strictObject({
        id: GF.id(lang)
    }),
    body: z.strictObject({
        phone: GF.phone(lang),
        fullName: GF.fullName(lang),
        gender: GF.gender(lang),
        DOB: GF.DOB(lang),
    })
})

export const userProfileSchema = (lang = langEnum.en) => z.object({
    params: z.strictObject({
        userId: GF.id(lang)
    }).refine((data) => {
        return mongoose.isValidObjectId(data.userId)
    }, {
        message: "invalid objectId",
        path: ["params", "userId"]
    })
})