// src/app.js
import express from "express";
import cors from "cors";
import { verifyJWT } from "./middleware/jwtauth.middleware.js";
import UserRoute from "./routes/user.routes.js";
import propertyRoute from "./routes/property.routes.js";

const app = express();

// Middleware configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// Example route for user login (handled in user.routes.js)
app.use("/api/v1/users", UserRoute);

// Protected route example
app.get("/api/v1/protected", verifyJWT, (req, res) => {
  res.send("This is a protected route");
});

app.use("/api/v1/properties", propertyRoute);

export { app };
