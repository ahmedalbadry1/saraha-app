import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
 
},{timestamps : true})

export const messageModel = mongoose.model("Message",messageSchema)