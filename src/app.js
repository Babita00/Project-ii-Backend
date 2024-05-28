import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  }),
);
app.use(express.json({ limit: "16kb;" }));
app.use(express.urlencoded);
app.use(express.static("public"));
app.use(cookieParser());

import UserRoute from "./routes/user.routes.js";
app.use("/api/v1/users", UserRoute);
export { app };
