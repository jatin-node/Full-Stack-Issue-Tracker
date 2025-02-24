import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;
import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";


import Db from "./config/mongoose-connection.js";

import indexRouter from "./routes/indexRouter.js";
import adminRouter from "./routes/adminRouter.js";
import employeeRouter from "./routes/employeeRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", 1);

// Enable CORS for all routes
let isProduction = process.env.NODE_ENV === "production";
app.use(
  cors({
    origin: isProduction
      ? process.env.VITE_FRONTEND_URL // Production URL
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/employee", employeeRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
