import express from "express"   
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes.js";

dotenv.config({
    path:"../.env"
})

const app = express();

app.use(express.json())
app.use(cookieParser());

const PORT = process.env.PORT || 8080;


app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
    console.log("Server is listening at port : 8080")
});