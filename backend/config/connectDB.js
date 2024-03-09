const mongoose = require('mongoose')

const connectDB = async(req,res)=>{
    try {
        await mongoose.connect(process.env.DATABASE, {

            useNewUrlParser: "true",
            useUnifiedTopology: "true"
          
          })
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB