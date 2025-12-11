import express from "express";
import dotenv from "dotenv";
import connection from "./config/db.js";
import router from "./routes/urlRoutes.js";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
dotenv.config();

const PORT = process.env.PORT;
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/shortify", router);

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // stop the app
  }

  console.log("Database connected.");

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
