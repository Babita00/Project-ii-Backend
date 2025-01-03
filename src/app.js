import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { verifyJWT } from "./middleware/jwtauth.middleware.js";
import UserRoute from "./routes/user.routes.js";
import propertyRoute from "./routes/property.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { saveMessage, getMessages } from "./controllers/chat.controllers.js";

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

// Routes
app.use("/api/v1/users", UserRoute);
app.use("/api/v1/properties", propertyRoute);
app.use("/api/v1/chats", chatRoutes);

export default server;
