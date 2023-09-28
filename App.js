const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const mongoose = require("mongoose");
const course = require("./Routes/Course");
const user = require("./Routes/User");
const Auth = require("./Routes/Auth");
const enroll = require("./Routes/EnrolledCourse");
const Quize = require("./Routes/Quiz");
const cors = require("cors");
const Joi = require("joi");
require("joi-objectid")(Joi);
const corsOptions = {
  origin: "exp://192.168.1.7:8081",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((errr) => {
    console.log(errr);
  });
app.use("/uploads", express.static("uploads"));
app.use("/api/course", course);
app.use("/api/user", user);
app.use("/api/auth", Auth);
app.use("/api/enroll", enroll);
app.use("/api/quiz", Quize);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server listen port 3000");
});
