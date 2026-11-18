import mongoose from "mongoose"
import z from "zod"

export const userProfileSchema = z.object({

    params:z.strictObject({
        userId : z.string().length(24)
    }).refine(({userId})=>{

        return mongoose.isValidObjectId(userId)
    },{
        error:"invalied userId",
        path:["params","userId"]
    })

})