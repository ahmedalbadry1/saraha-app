import { Router } from "express";
import * as us from "./auth.service.js"
import { auth, successResponce ,tokenTypeEnum, validator} from "../../common/index.js";
import { loginSchema, signupSchema, confirmEmailSchema, sendOtpSchema, googleLoginSchema } from "./auth.validation.js";

export let authRouter = Router()
 

authRouter.post("/signUp",validator(signupSchema) ,async(req, res, next)=>{

     await us.signUp(req.validate.body)

    return successResponce ({
        res , status:200 , message :"user created succesfully but confirm your email "
    })
})

authRouter.post ("/logIn", validator(loginSchema),async(req, res , next)=>{
   let token =  await us.logIn(req.validate.body)

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

authRouter.post("/login/google", validator(googleLoginSchema), async (req, res, next) => {
  const issuer = `${req.protocol}://${req.get("host")}`;
  const { tokens, status } = await us.loginWithGoogle({
    idToken: req.validate.body.idToken,
    issuer,
  });

  return successResponce({
    res,
    status,
    message: status == 200 ? "User logged in" : "User created",
    data: { tokens }, 
  });
});

authRouter.patch("/confirm/email", validator(confirmEmailSchema), async(req,res,next)=>{


  await us.confermEmail({otp: req.validate.body.otp, email: req.validate.body.email})

  return successResponce({
    res,status:200,message:"email confermed successfully"
  })


})


authRouter.post("/forgetPassword",async(req,res,next)=>{
  
})