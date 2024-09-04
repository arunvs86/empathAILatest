import mongoose from "mongoose"

const connectToDatabase = async () => {
    try{
        await mongoose.connect(process.env.mongoDBConnectionString)
        console.log("Database connection is succesful")
    } catch(error){
        console.log(error)
    }
} 

export default connectToDatabase;