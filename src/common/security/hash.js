 import{ hash  , compare} from "bcrypt"
import { SALT } from "../../config/config.service.js"

 export const myHash = async ({plainText})=>{

    return await hash (plainText ,SALT) 

 }

 export const myCompare = async({plainText , hashed})=>{

    return await compare(plainText,hashed)

 }