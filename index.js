import dotenv from "dotenv";
import express from "express";
import cors from "cors";

const app = express();
dotenv.config();

// Cors policy issue on frontend fixing
app.use(cors());

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Port running at https://localhost:${port}`);
});
