require('dotenv').config()
const mongoose = require('mongoose')
let conn = mongoose.connection // Declare the conn variable outside the function

// Inside mongoose.js
const connectToDatabase = async () => {
    try {
        mongoose.set('strictQuery', false)

        await mongoose.connect(process.env.MYDB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}

// Immediately call the function to establish the connection
connectToDatabase()

module.exports = { conn } // Export the conn object