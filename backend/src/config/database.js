const mongoose = require("mongoose");

/*
|--------------------------------------------------------------------------
| MongoDB Database Connection
|--------------------------------------------------------------------------
| Handles MongoDB connection using mongoose.
| Includes error handling and connection status listeners.
|--------------------------------------------------------------------------
*/

const connectToDB = async () => {
  try {

    // Check MongoDB URI exists
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }


    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.MONGO_URI);


    console.log(
      `MongoDB Connected Successfully: ${connection.connection.host}`
    );

  } catch (error) {

    console.error(
      `MongoDB Connection Failed: ${error.message}`
    );


    // Stop application if database fails
    process.exit(1);
  }
};


/*
|--------------------------------------------------------------------------
| MongoDB Connection Events
|--------------------------------------------------------------------------
| Helps in monitoring database connection state.
|--------------------------------------------------------------------------
*/


// When database disconnects
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Disconnected");
});


// When database reconnects
mongoose.connection.on("reconnected", () => {
  console.log("MongoDB Reconnected");
});


// Database connection error
mongoose.connection.on("error", (error) => {
  console.error(`MongoDB Error: ${error.message}`);
});


module.exports = connectToDB;