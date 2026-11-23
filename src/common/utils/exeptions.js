const mainException = ({
    message = "Internal server error",
    cause = 500,
}) => {
    throw new Error(message, { cause })
}

export const NotFound = (message) => {
    mainException({ message: message ?? "Not found", cause: 404 })
}

export const BadRequest = (message) => {
    mainException({ message: message ?? "Bad request", cause: 400 })
}

export const Unauthorized = (message) => {
    mainException({ message: message ?? "Unauthorized", cause: 401 })
}

export const Forbidden = (message) => {
    mainException({ message: message ?? "Forbidden", cause: 403 })
}

export const Conflict = (message) => {
    mainException({ message: message ?? "Conflict", cause: 409 })
}

export const UnprocessableEntity = (message) => {
    mainException({ message: message ?? "Unprocessable entity", cause: 422 })
}

export const TooManyRequests = (message) => {
    mainException({ message: message ?? "Too many requests", cause: 429 })
}

export const InternalServerError = (message) => {
    mainException({ message: message ?? "Internal server error", cause: 500 })
}

export const ServiceUnavailable = (message) => {
    mainException({ message: message ?? "Service unavailable", cause: 503 })
}
