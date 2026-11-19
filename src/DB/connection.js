import mongoose from "mongoose"
import configService from "../config/config.service.js"
import { client } from "./redis.connection.js"


export let DBConnection = async()=>{
    try{
        await mongoose.connect(configService.DB_url)
        await mongoose.syncIndexes()
        console.log("db connected")
        await client.connect()
        console.log("cash connected")
    }catch(err)
    {
        throw err


    }
}