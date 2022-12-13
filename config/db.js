const mongoose = require('mongoose');
const connectWithDb = async() => {
  //this is a setting done for Mongoose 7
  mongoose.set('strictQuery', false)
  try {

    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("db was connected successfully")

  } catch (error) {
    console.log(`db connection error: ${error}`);
    // graceful exit of server, if you dont use this, the server hangs
    process.exit(1);
  }
    
    
  
        
}


//here we are exporting the db connection function.
module.exports = connectWithDb