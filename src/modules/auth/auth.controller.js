import { Router } from "express";
import * as us from "./auth.service.js"
import { auth, successResponce ,tokenTypeEnum} from "../../common/index.js";

export let authRouter = Router()
 

authRouter.post("/signUp", async(req, res, next)=>{

     await us.signUp(req.body)

    return successResponce ({
        res , status:200 , message :"user created succesfully "
    })
})

authRouter.post ("/logIn", async(req, res , next)=>{
   let token =  await us.logIn(req.body)

    return successResponce({res , status : 201 , message :"loged in succesfully" ,data:token})
})

authRouter.post("/rotate-token",auth({tokenType:tokenTypeEnum.refresh}),async(req,res,next)=>{
    const tokens = await us.rotateToken({ user: req.user, payload: req.payload })
      return successResponce({
            res,
            data: tokens,
            message: "token rotated"
        });
})
