import express from "express"   
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

dotenv.config({
    path:"../.env"
})

const app = express();

app.use(express.json())
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.listen(PORT, () => {
    console.log("Server is listening at port : 8080")
});