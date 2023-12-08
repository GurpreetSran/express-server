import express from "express";
import http from "http";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";

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

server.listen(3000, () => {
  console.log("Server started on port 3000");
});

const MONGO_URL = "mongodb://localhost:27017";

mongoose.Promise = Promise;

mongoose.connect(MONGO_URL);

mongoose.connection.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
