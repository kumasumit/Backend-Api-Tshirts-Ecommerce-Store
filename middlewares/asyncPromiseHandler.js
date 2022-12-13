//try catch and async-await or use promise.then().catch() syntax instead

const CustomError = require("../utils/CustomError");

const asyncPromiseHandler = func => (req, res, next) => {
    Promise.resolve(func(req, res, next))
    //the code will come here if any unhandled 
    //errors when executing the async function around which this function is wrapped
    
    .catch((error) => {
        console.log("Inside the catch block")
        console.log(error.message);
        //console.log(next.toString())
        //here everytime we are throwing a server error we can also change that error later
        next(new CustomError(error.message, 500));
    });
}

module.exports = asyncPromiseHandler;