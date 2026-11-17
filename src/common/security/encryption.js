import Crypto from "crypto"
import configService from "../../config/config.service.js"

let key = Buffer.from(configService.ENC_KEY,"hex")


export const encryption = (plaintext)=>{

    const iv = Crypto.randomBytes(configService.ENC_IV_LENGTH)
    let cipherIv=Crypto.createCipheriv(configService.ENC_ALGO,key,iv)
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