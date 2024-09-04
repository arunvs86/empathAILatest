import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectToDatabase from "./database/mongoDb.js"
import carerRoutes from "./routes/carerRoutes.js"
import thoughtRoutes from "./routes/thoughtRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { empathAiApp, server } from "./socketConfig/socketConnection.js";
import path from "path";

dotenv.config();


const portNumber = process.env.portNumber || 3000;

const __dirname = path.resolve();

//middlewares
empathAiApp.use(express.json());
empathAiApp.use(cookieParser());
empathAiApp.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.URL,
    credentials: true
}
empathAiApp.use(cors(corsOptions));


empathAiApp.use("/api/v1/carer",carerRoutes)
empathAiApp.use("/api/v1/thought", thoughtRoutes);
empathAiApp.use("/api/v1/message", messageRoutes);

empathAiApp.use(express.static(path.join(__dirname, "/clientSide/dist")));
empathAiApp.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "clientSide", "index.html"));
})

server.listen(portNumber, ()=>{
    connectToDatabase();
    console.log(`Server is up and running on port ${portNumber}`);
})