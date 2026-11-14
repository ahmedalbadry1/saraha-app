import { userModel } from "../DB/model/index.js";

export let findUser = async(email)=>
{
    return await userModel.findOne({email})
}

export let createUser = async (data) =>{
    return await userModel.create(data)
}

export const findUserById = async (id) => {
    return await userModel.findById(id).select("-password")
}

export const updateUser = async (id, data) => {
    return await userModel.findOneAndUpdate(
        { _id: id },
        data,
        { new: true, runValidators: true }
    ).select("-password")
}
