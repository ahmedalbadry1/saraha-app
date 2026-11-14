import { RoleEnum } from "../enums/index.js";
import { exeption } from "../utils/index.js";

export const authorization = ({role = 0})=>{

    return (req,res,next)=>{
        if(role === RoleEnum.admin && req.user.role !== RoleEnum.admin)
        {
            return exeption.forbidden({message :"access denied"})
        }

        next ();
    }

}