import mongoose from "mongoose";
import { MONGOURI } from "./postDB.config.js";

export const connectDB = () => {
  console.log("Inside MonogoDbConnector");
  mongoose
    .connect(MONGOURI, {})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Connection Error", err));
};
