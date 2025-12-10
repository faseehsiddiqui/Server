import express, { Application } from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import errorHandler from "./middleware/errorHandler";

const app: Application = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/users", userRoutes); // User routes

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Global Error Handler
app.use(errorHandler);

export default app;
