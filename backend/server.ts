import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { signup, login } from "./controllers/UserController";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const contentLength = req.headers["content-length"];
  console.log(
    `==> \x1b[33m${req.method} ${req.url}\x1b[0m` +
      " " +
      `\x1b[36mPayload Size: ${
        contentLength ? contentLength + " bytes" : "unknown"
      }\x1b[0m\n`
  );
  next();
});

app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
