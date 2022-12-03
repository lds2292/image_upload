require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");

const app = express();
const { MONGO_URL, PORT } = process.env;
const { authenticate } = require("./middleware/authentication");

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");

    app.use("/uploads", express.static("uploads"));
    app.use(express.json());
    app.use(authenticate);
    app.use("/images", imageRouter);
    app.use("/user", userRouter);

    app.listen(PORT, () => {
      console.log("Express server listening on PORT = " + PORT);
    });
  })
  .catch((err) => console.log(err));
