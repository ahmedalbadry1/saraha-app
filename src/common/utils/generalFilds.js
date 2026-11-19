import z from "zod"
import mongoose from "mongoose"
import { langEnum } from "../enums/lang.enum.js"
import { getErrorMessage } from "./validationErrors.js"

export const GF = {
  string: (lang = langEnum.en) =>
    z.string({
      error: lang == langEnum.ar
        ? "يجب أن تكون القيمة نصًا"
        : "Value must be a string",
    }),

  email: (lang = langEnum.en) =>
    z.email({
      error: getErrorMessage("invalidEmail", lang),
      pattern: z.regexes.email,
    }),

  password: (lang = langEnum.en) =>
    z.string({
      error: lang == langEnum.ar
        ? "كلمة المرور يجب أن تكون نصًا"
        : "Password must be a string",
    })
      .max(20, {
        error: getErrorMessage("passwordTooLong", lang),
      })
      .min(5, {
        error: getErrorMessage("passwordTooShort", lang),
      }),

  phone: (lang = langEnum.en) =>
    z.e164({
      pattern: /^01[0-25]\d{8}$/,
      error: getErrorMessage("wrongPhoneNumber", lang),
    }),

  id: (lang = langEnum.en) =>
    z.string().min(24).max(24).refine(
      (value) => mongoose.isValidObjectId(value),
      {
        error: getErrorMessage("invalidObjectId", lang),
      },
    ),

  fullName: (lang = langEnum.en) =>
    z.string({
      error: getErrorMessage("fullName", lang),
    }).regex(/^[A-Za-z]{3,20}\s[A-Za-z]{3,20}$/, {
      error: getErrorMessage("fullName", lang),
    }),

  gender: (lang = langEnum.en) =>
    z.int({
      error: lang == langEnum.ar
        ? "الجنس غير صالح"
        : "Invalid gender",
    }),

  DOB: (lang = langEnum.en) =>
    z.string({
      error: lang == langEnum.ar
        ? "تاريخ الميلاد غير صالح"
        : "Invalid date of birth",
    }).regex(/^\d{4}-\d{2}-\d{2}$/, {
      error: lang == langEnum.ar
        ? "تاريخ الميلاد يجب أن يكون بصيغة YYYY-MM-DD"
        : "Date of birth must use YYYY-MM-DD format",
    }),
}