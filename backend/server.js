require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");
const connectDB = require("./config/connectDB");
const morgan = require('morgan')

PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'))
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));
app.use('/task',require('./routes/taskRoutes'))
app.use('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }
})
connectDB()
mongoose.connection.once('open',()=>{
    console.log('mongodb is connected')
    app.listen(PORT, () => {
        console.log(`server is running on ${PORT}`);
      });
})

mongoose.connection.on('err',()=>{
    console.log(err)
})


