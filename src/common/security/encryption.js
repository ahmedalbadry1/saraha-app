import Crypto from "crypto"
import {ENC_KEY,ENC_IV_LENGTH,ENC_ALGO} from "../../config/config.service.js"
import { buffer } from "stream/consumers"

let key = Buffer.from(ENC_KEY,"hex")


export const encryption = (plaintext)=>{

    const iv = Crypto.randomBytes(ENC_IV_LENGTH)
    let cipherIv=Crypto.createCipheriv(ENC_ALGO,key,iv)
    let result = cipherIv.update(plaintext,"utf-8","hex")
    result += cipherIv.final("hex")
    return `${iv.toString("hex")} :: ${result}`
}

export const decryption = (cipherText)=>{
    let [hexIv , encrypted] = cipherText.split("::").map(part=>part.trim())
    const iv = Buffer.from(hexIv,"hex")
    const decipherIv = Crypto.createDecipheriv(ENC_ALGO,key,iv)
    let result = decipherIv.update (encrypted , "hex" , "utf-8")
    result += decipherIv.final("utf-8")
    return result
}