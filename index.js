const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter=require('./router/user');
const postRouter=require('./router/post');
dotenv.config();
const app = express();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("eroor happend");
  });

// app.get("/", (req, res) => {
//   res.send("chu"); //adding data to the page
// });

app.use(express.json());
app.use('/api/user',userRouter);
app.use("/api/post",postRouter);

app.listen(5000, (req, err) => {
  console.log("running the server");
  if (err) {
    console.log(err);
  }
});
