import express from "express";
import http from "http";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyparser.json());

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

mongoose.Promise = Promise;

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

app.use("/", router());
