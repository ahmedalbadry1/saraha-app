import {ur}from "../../repo/index.js"
import {decryption, encryption, exeption, RoleEnum} from "../../common/index.js"
import mongoose from "mongoose"

export const profile = (user) => {
    const data = user.toObject()

    if (data.phone) {
        data.phone = decryption(data.phone)
    }

    return data
}

export const updateUser = async ({ user, id, data }) => {
    if (!mongoose.isObjectIdOrHexString(id)) {
        exeption.badRequest({ message: "Invalid user id" })
    }
    if (user.role !== RoleEnum.admin && user._id.toString() !== id.toLowerCase()) {
        exeption.forbidden({ message: "You can only update your own account" })
    }

    const allowedFields = ["firstName", "lastName", "email", "gender", "phone"]
    if (!data || typeof data !== "object" || Array.isArray(data) ||
        !Object.keys(data).length || Object.keys(data).some(field => !allowedFields.includes(field))) {
        exeption.badRequest({ message: "Send only firstName, lastName, email, gender or phone" })
    }

    const updates = { ...data }
    if (Object.hasOwn(updates, "phone")) {
        if (typeof updates.phone !== "string" || updates.phone.length < 11) {
            exeption.badRequest({ message: "Phone must be a string of at least 11 characters" })
        }
        updates.phone = encryption(updates.phone)
    }

    let updatedUser
    try {
        updatedUser = await ur.updateUser(id, updates)
    } catch (error) {
        if (error.code === 11000) {
            exeption.conflict({ message: "Email already exists" })
        }
        if (error.name === "ValidationError" || error.name === "CastError") {
            exeption.badRequest({ message: error.message })
        }
        throw error
    }
    if (!updatedUser) {
        exeption.notFound({ message: "user not found" })
    }
    return profile(updatedUser)
}
