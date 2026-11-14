import express from "express"
import { port } from "./config/config.service.js"
import { DBConnection } from "./DB/connection.js"
import { errorHandler } from "./common/index.js"
import {authRouter, userRouter}from "./modules/index.js"
import Crypto from "crypto"
const app = express()


app.use(express.json())

await DBConnection()

app.use("/auth", authRouter)
app.use("/user", userRouter)

app.use(errorHandler)


app.listen(port, () => console.log(`saraha app listening on port ${port}!`))
