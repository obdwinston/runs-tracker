import path from "path";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import colors from "colors";

import runRoutes from "./routes/runRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// express
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// routes
app.use("/api/runs", runRoutes);
app.use("/api/user", userRoutes);

// mongoose
mongoose
  .connect(process.env.MONGODB)
  .then((connection) => {
    // connect
    console.log(
      `Database connected: ${connection.connection.host}`.cyan.underline
    );

    // listen
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  })
  .catch((error) => {
    console.log(`Connection error: ${error.message}`.red.underline.bold);
    process.exit(1);
  });

// deployment
if (process.env.MODE === "deployment") {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}
