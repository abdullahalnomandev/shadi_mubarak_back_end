import mongoose from "mongoose";
import app from "./app";
import config from "./config";

const main = async () => { 
  const {database_url,port} = config;

    try {
      await mongoose.connect(database_url as string);
      console.log("Database connection successfully.")
      app.listen(port, () => {
        console.log(`app listening on port ${port}`)
      })
      
  
    } catch (err) {
      console.log("Failed to connect database ",err);
    }
  
  };
  
  main()