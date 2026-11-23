import mongoose from "mongoose";
import { genderEnum, providerEnum, RoleEnum, emailEnum } from "../../common/enums/index.js";



const userSchema = new mongoose.Schema({

  firstName: {
    type: String,
    maxLength: 50,
    minLength: 2,
    required: true,
  },

  lastName: {
    type: String,
    maxLength: 50,
    minLength: 2,
    required: true,
  },

  email: {
    type: String,
    maxLength: 50,
    minLength: 2,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  gender: {
    type: Number,
    enum: Object.values(genderEnum),
    default: genderEnum.male

  },
  password: {
    required: function () {
      return this.provider == providerEnum.system
    },
    type: String,
    minLength: 8
  },
  phone: {
    type: String,
    minLength: 11,


  },
  role: {
    type: Number,

    enum: Object.values(RoleEnum),

    default: RoleEnum.user


  },
  provider: {
    type: Number,
    enum: Object.values(providerEnum),
    default: providerEnum.system
  },
  image: {
    type: String
  },
  isVerified: {
    type: Number,
    enum: Object.values(emailEnum),
    default: function () {
      return this.provider
    }
  }, changeCredentialsAt: {
    type: Date
  }
}, {
  timestamps: true,
  strict: true,
  strictQuery: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true,
  },

})

userSchema.virtual("userName").set(function (value) {
  let [firstName, lastName] = value.split(" ")
  this.firstName = firstName,
    this.lastName = lastName
}).get(function () {
  return `${this.firstName} ${this.lastName}`
})
userSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 300,
    partialFilterExpression: { isVerified: emailEnum.notVerified },
  }
);

export const userModel = mongoose.model("User", userSchema)
