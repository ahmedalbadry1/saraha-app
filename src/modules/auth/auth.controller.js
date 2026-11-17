import { Router } from "express";
import * as us from "./auth.service.js"
import { auth, successResponce ,tokenTypeEnum, validation} from "../../common/index.js";
import { loginSchema, signupSchema, confirmEmailSchema, sendOtpSchema, googleLoginSchema } from "./auth.validation.js";

export let authRouter = Router()
 

authRouter.post("/signUp",validation(signupSchema) ,async(req, res, next)=>{

     await us.signUp(req.validated)

    return successResponce ({
        res , status:200 , message :"user created succesfully but confirm your email "
    })
})

authRouter.post ("/logIn", validation(loginSchema),async(req, res , next)=>{
   let token =  await us.logIn(req.validated)

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

authRouter.post("/login/google", validation(googleLoginSchema), async (req, res, next) => {
  const issuer = `${req.protocol}://${req.get("host")}`;
  const { tokens, status } = await us.loginWithGoogle({
    idToken: req.validated.idToken,
    issuer,
  });

  return successResponce({
    res,
    status,
    message: status == 200 ? "User logged in" : "User created",
    data: { tokens }, 
  });
});

authRouter.patch("/confirm/email", validation(confirmEmailSchema), async(req,res,next)=>{


  await us.confermEmail({otp: req.validated.otp, email: req.validated.email})

  return successResponce({
    res,status:200,message:"email confermed successfully"
  })


})

authRouter.post("/send/otp", validation(sendOtpSchema), async(req,res,next)=>{
  let otp = await us.generateOtp(req.validated.email)

  return successResponce({
    res,status:200,message:"otp sent succesfully"
  })


})

authRouter.post("/forgetPassword",async(req,res,next)=>{
  
})