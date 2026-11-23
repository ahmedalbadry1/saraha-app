import express from "express"
import configservice from "./config/config.service.js"
import { DBConnection } from "./DB/connection.js"
import { errorHandler } from "./common/index.js"
import {authRouter, userRouter}from "./modules/index.js"
import cors from "cors";

const app = express()


app.use(cors(),express.json())

await DBConnection()

app.use("/auth", authRouter)
app.use("/user", userRouter)

app.use(errorHandler)


app.listen(configservice.port, () => console.log(`saraha app listening on port ${configservice.port}!`))
