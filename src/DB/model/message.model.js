import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    otp:{
        type:String,
        

    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
    },
    createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 
  }
},{timestamps : true})

export const messageModel = mongoose.model("Message",messageSchema)