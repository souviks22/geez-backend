import express from "express"
import mongoose from "mongoose"

process.loadEnvFile()

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Database Connected'))
    .catch(console.error)

const app = express()

app.listen(process.env.PORT, () => console.log(`Server is active at PORT ${process.env.PORT}`))