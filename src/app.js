import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// multer for file upload
app.use(express.json({ limit: "16kb" })); // for formdata, when data comes from url -> express.urlencoded
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // in extended when can give objects inside the objects
app.use(express.static("public")); // to keep the assets
app.use(cookieParser()); // to perform CRUD operation using cookiePraser

// (error, req, res, next)

//routes import
import userRouter from "./routes/user.routes.js";

// routes declarartion
app.use("/api/v1/users", userRouter);


export { app };
