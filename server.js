import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
// import path from "path";
import { fileURLToPath } from "url";

//resolving dirname for ESModule
const __filename = fileURLToPath(import.meta.url);

//configure env
dotenv.config();

//database cnonig
connectDB();

//rest object
const app = express();

//middleware
app.use(cors());
// pp.use(
//   cors({
//     origin: ["http://localhost:3000", "http://pawan-store-2024.onrender.com"],
//   })
// );
app.use(express.json());
app.use(morgan("dev"));

//use client app
// app.use(express.static('/client/'))

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

//port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
  );
});
