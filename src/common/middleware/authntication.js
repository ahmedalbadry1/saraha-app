import { ur } from "../../repo/index.js";
import { verifyToken } from "../security/index.js";
import { exeption } from "../utils/index.js";
import { tokenTypeEnum } from "../enums/index.js";


export const auth = ({ tokenType = tokenTypeEnum.access }) => {
 return async (req,res,next)=>{
 let token = req.headers.authorization
 if(!token)exeption.badRequest({message:"token not provided"})
    req.payload = verifyToken({token, tokenType})
    let {sub} = req.payload
    req.user = await ur.findUserById(sub) 
 
    if (!req.user) {
    exeption.notFound({ message: "user not found" })
}
  
    next()
 }
}
