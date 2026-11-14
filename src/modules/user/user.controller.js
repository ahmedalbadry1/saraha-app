import { Router } from "express";
import * as us from "./user.service.js"
import { successResponce , auth ,authorization ,tokenTypeEnum, RoleEnum} from "../../common/index.js"


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
