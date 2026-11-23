import { ur } from "../../DB/repo/index.js";
import { verifyToken } from "../security/index.js";
import { exeption } from "../utils/index.js";
import { tokenTypeEnum } from "../enums/index.js";


export const auth = ({ tokenType = tokenTypeEnum.access }) => {
 return async (req,res,next)=>{
 let token = req.headers.authorization
 if(!token)exeption.BadRequest("token not provided")

  token = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    req.payload = await verifyToken({token, tokenType})
    let {sub} = req.payload
    req.user = await ur.findById({ id: sub, projection: "-password" }) 
 
    if (!req.user) {
    exeption.NotFound("user not found")
}
  
    next()
 }
}
