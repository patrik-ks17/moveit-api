const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("./models/userModel")

app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
  });


const registerRoute = require("./routes/Register");
app.use("/register", registerRoute);

const loginRoute = require("./routes/Login");
app.use("/login", loginRoute);

const userRouter = require("./routes/User");
app.use("/user", userRouter);

const profileRouter = require("./routes/Profile");
app.use("/profile", profileRouter);

const markerRouter = require("./routes/Marker");
app.use("/marker", markerRouter);

const chatRouter = require("./routes/Chat");
app.use("/chat", chatRouter);


app.listen(process.env.PORT, '0.0.0.0',() => {
  console.log("Server listening on port: " + process.env.PORT);
});
