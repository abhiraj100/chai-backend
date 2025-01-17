// require('dotenv').config();
// require('dotenv').config({path: "./env"});

import dotenv from "dotenv";
// dotenv.config();
import express from "express";
import connectDB from "./db/index.js";
const app = express();

dotenv.config({
  path: "./env",
});
connectDB();

// const connectDB = async () => {

// }

// connectDB();

/*

import dotenv from "dotenv";
// dotenv.config();
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
const app = express();

import connectDB from "./db/index.js";





(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening at http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR : ", error);
    throw error;
  }
})();

*/
