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

// Serve static files from the clientSide/dist directory
empathAiApp.use(express.static(path.join(__dirname, "clientSide", "dist")));

// Catch-all route to serve index.html for all non-static routes
empathAiApp.get("*", (req, res) => {
  // Check if the request is for an asset (like .js, .css, or .png files)
  if (req.originalUrl.startsWith('/api')) {
    // If it's an API route, don't serve index.html, let the API route handle it
    return next();
  }

  // If it's not an API or static file request, serve the index.html
  res.sendFile(path.resolve(__dirname, "clientSide", "dist", "index.html"));
});


server.listen(portNumber, ()=>{
    connectToDatabase();
    console.log(`Server is up and running on port ${portNumber}`);
})