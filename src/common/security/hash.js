 import{ hash  , compare} from "bcrypt"
import configService from "../../config/config.service.js"

 export const myHash = async ({plainText})=>{

    return await hash (plainText ,configService.SALT) 

 }

 export const myCompare = async({plainText , hashed})=>{

    return await compare(plainText,hashed)

 }