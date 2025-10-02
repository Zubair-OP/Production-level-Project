import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const MONGO_DB = async ()=>{
    try {
      const connectionIInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
      console.log(`\n mongoDB connected at host ${connectionIInstance.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default MONGO_DB;