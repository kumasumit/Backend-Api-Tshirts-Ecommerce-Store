require('dotenv').config();
const connectWithDb = require('./config/db');
const app = require('./app');
const cloudinary = require('cloudinary');

//here we connect the database before the routes are loaded, and before the server is started
connectWithDb();

//ask rahul, why server console is printing first and db connect success is showing last in terminal,
//is this because db connect is async and server function is synchronous
//cloudinary config goes here, just after the db is connected
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
//the router middleware will be second last just before the error middleware is called
//this tells the index/root that all routes will be handled by index.js files in routes folder
//use express Router
//the router middleware for /api/v1
app.use('/api/v1', require('./routes'));
//this tells the app to fetch all the routes from index file in routes folder

//error middleware for the entire app, this middleware will be at the very last after every middleware is executed
//use this middleware to handle all errors
app.use(function(err, req, res, next) {
    //ask rahul, if we need to do this, and also what is use of all this.
    if(err){
        console.log(err);
        console.log("Error code = "+ err.status);
        console.log("Error Message = "+ err.message);
    }
    //here if status of error is given we use that error status, if not we use 400 for now
    //but in future the error status and much better error handling can be done
    return res.status(err.status || 400).json({message: err.message, success: false});
    //ask rahul , in next can we do process.exit(1) for graceful exit
})

app.listen(process.env.PORT, ()=> {
    console.log('Server listening on port: '+ process.env.PORT);
})