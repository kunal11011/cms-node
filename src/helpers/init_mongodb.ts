import mongoose from "mongoose";
import { config } from "dotenv";

config();

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017",
    {
      dbName: process.env.DB_NAME,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB.");
  })

  mongoose.connection.on("error", (err) => {
    console.log(err);
  })

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected.");
  })

  process.on("SIGINT",async () => {
    await mongoose.connection.close();
    process.exit(0);
  })