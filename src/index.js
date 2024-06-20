import dotenv from "dotenv";
import connectDB from "./db/dataBaseConnect.js";
import server from "./app.js";

dotenv.config({
  path: "./.env",
});

// Connect to the database
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection FAILED", err);
  });
