import express from "express"   
import dotenv from "dotenv"

dotenv.config({
    path:"../.env"
})

const app = express();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server is listening at port : 8080")
});