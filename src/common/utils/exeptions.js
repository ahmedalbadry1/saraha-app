const mainExiption = ({
    message = "internal server eror", cause =500 
}) =>{
    throw new Error (message , {cause})
}

export const notFound = ({message,cause})=>{

    mainExiption({
        message,
        cause:404
    })
}

export const badRequest = ({message = "Bad request"} = {}) => {
    mainExiption({message, cause:400})
}

export const unauthorized = ({message = "Unauthorized"} = {}) => {
    mainExiption({message, cause:401})
}

export const forbidden = ({message = "Forbidden"} = {}) => {
    mainExiption({message, cause:403})
}

export const conflict = ({message = "Conflict"} = {}) => {
    mainExiption({message, cause:409})
}

export const unprocessableEntity = ({message = "Unprocessable entity"} = {}) => {
    mainExiption({message, cause:422})
}

export const tooManyRequests = ({message = "Too many requests"} = {}) => {
    mainExiption({message, cause:429})
}

export const internalServerError = ({message = "Internal server error"} = {}) => {
    mainExiption({message, cause:500})
}

export const serviceUnavailable = ({message = "Service unavailable"} = {}) => {
    mainExiption({message, cause:503})
}
