

import mongoose from "mongoose"
import configService from "../config/config.service.js"


export let DBConnection = async()=>{
    try{
        await mongoose.connect(configService.DB_url)
        await mongoose.syncIndexes()
          console.log("db connected")
    }catch(err)
    {
        throw err


    }
}