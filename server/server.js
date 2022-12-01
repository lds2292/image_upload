require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");

const app = express();
const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");

    app.use("/uploads", express.static("uploads"));

    app.use("/images", imageRouter);

    app.listen(PORT, () => {
      console.log("Express server listening on PORT = " + PORT);
    });
  })
  .catch((err) => console.log(err));
