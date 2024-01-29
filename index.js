import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./configs/connectdb.js";

// dotenv config
dotenv.config();

const app = express();
// Cors policy issue on frontend fixing
app.use(cors());

const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
// data base connecting
connectDB(databaseUrl);

// Config JSON
app.use(express.json());

// listen app
app.listen(port, () => {
  console.log(`Port running at https://localhost:${port}`);
});
