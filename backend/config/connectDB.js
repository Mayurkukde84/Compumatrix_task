const mongoose = require('mongoose')

const connectDB = async(req,res)=>{
    try {
        await mongoose.connect(process.env.DATABASE)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB