import { Router } from "express";
import * as us from "./user.service.js"
import { successResponce , auth ,authorization ,tokenTypeEnum, RoleEnum,validator} from "../../common/index.js"
import { userProfileSchema } from "./user.validation.js";
import { localUpload,processFiles,fileTypes } from "../../common/middleware/multer.js";


export const userRouter = Router()

userRouter.patch("/:id", auth({ tokenType: tokenTypeEnum.access }), async (req, res, next) => {
    const user = await us.updateUser({ user: req.user, id: req.params.id, data: req.body })
    return successResponce({ res, message: "User updated successfully", data: user })
})

userRouter.get("/profile", auth({tokenType : tokenTypeEnum.access}), authorization({role:RoleEnum.user}),(req, res, next) => {
  

  
    return successResponce({
        res,
        message: "User fetched successfully",
        data: us.profile(req.user)
    })
})

userRouter.get("/profile/:userId",validator(userProfileSchema),async(req,res,next)=>{
    let user = await us.getProfileByID(req.params.userId)
    successResponce({res ,message:"user found",data:user})
})

userRouter.post("/image",localUpload({storageFolder: "users",types: fileTypes.image,useMemoryStorage: true,}).single("image"),processFiles({types: fileTypes.image,storageFolder: "users",}),async(req,res,next)=>{
    successResponce({res,data:req.file})
})
userRouter.post("/images",localUpload({storageFolder: "users",types: fileTypes.image,useMemoryStorage: true,}).array("image", 3),processFiles({types: fileTypes.image,storageFolder: "users",}),async(req,res,next)=>{
    successResponce({res,data:req.files})
})