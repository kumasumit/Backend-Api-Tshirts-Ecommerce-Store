//try catch and async-await or use promise.then().catch() syntax instead

const CustomError = require("../utils/CustomError");

const asyncPromiseHandler = func => (req, res, next) => {
    Promise.resolve(func(req, res, next))
    //the code will come here if any unhandled 
    //errors when executing the async function around which this function is wrapped
    
    .catch((error) => {
        //by default if the control  comes here means that there has been some error in the try catch block
        let errorStatusCode = 500
        console.log("Inside the catch block")
        console.log(error)
        if(error._message == "users validation failed"){
            errorStatusCode = 400
        }
        console.log(error._message, errorStatusCode);
        //console.log(next.toString())
        //here everytime we are throwing a server error we can also change that error later
        next(new CustomError(error.message, errorStatusCode));
    });
}

module.exports = asyncPromiseHandler;