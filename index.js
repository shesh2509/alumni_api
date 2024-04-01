const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors")
const logger = require("morgan");
const authRoute = require("./routes/auth");
const userRouter = require("./routes/user");


const bodyParser = require("body-parser");



const app = express();
dotenv.config();


mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connection Successful!!"))
.catch((err) =>{
    console.log(err)
});

app.use(bodyParser.json({ limit: "5mb" })); // Set maximum payload size limit
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(express.json());
app.use(logger("tiny"));
app.use(cors({
    origin: 'https://alumni-app-beryl.vercel.app'
}));


app.use("/api/auth", authRoute);
app.use("/api/find", userRouter);


app.listen(process.env.PORT || 5000, () => {
    console.log("Backend Server is Running!")
})
