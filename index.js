import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDb from "./configs/connectdb.js";

// dotenv config
dotenv.config();

const app = express();
// Cors policy issue on frontend fixing
app.use(cors());

const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
// data base connecting
connectDb(databaseUrl);

app.listen(port, () => {
  console.log(`Port running at https://localhost:${port}`);
});
