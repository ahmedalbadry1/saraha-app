import mongoose from "mongoose";
import { genderEnum, RoleEnum } from "../../common/enums/index.js";

const userSchema=new mongoose.Schema({

    firstName:{
        type:String,
        maxLength:50,
        minLength:2,
        required:true,
    },
    
    lastName:{
        type:String,
        maxLength:50,
        minLength:2,
        required:true,
    },
    
    email:{
        type:String,
        maxLength:50,
        minLength:2,
        required:true,
        unique:true,
    },
      gender:{
        type:Number,
        enum: Object.values(genderEnum),
        default:genderEnum.male

      },
      password:{
        required:true,
        type:String,
        minLength:8
      },
      phone:{
        type:String,
        minLength:11,
        

      },
      role:{
        type:Number,

        enum:Object.values(RoleEnum),

        default:RoleEnum.user
    

      }
},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true,
    },
    
})

userSchema.virtual("userName").set(function(value){
    let [firstName,lastName]=value.split(" ")
    this.firstName =firstName,
    this.lastName =lastName
}).get(function(){
    return `${this.firstName} ${this.lastName}`
})

export const userModel = mongoose.model("User",userSchema)
