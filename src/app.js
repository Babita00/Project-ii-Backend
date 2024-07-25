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

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle incoming chat messages
  socket.on("chat message", async ({ sender, receiver, message, isSender }) => {
    console.log("Message received:", { sender, receiver, message, isSender });
    try {
      const chatMessage = await saveMessage(
        sender,
        receiver,
        message,
        isSender,
      );
      io.emit("chat message", chatMessage); // Broadcast the message to all connected clients
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/v1/users", UserRoute);
app.use("/api/v1/properties", propertyRoute);
app.use("/api/v1/chats", chatRoutes);

export default server;
