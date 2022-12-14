const User = require('../models/User');
const asyncPromiseHandler = require('../middlewares/asyncPromiseHandler');
const CustomError = require('../utils/CustomError');
// const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');

//1. controller to register/signup a user
//1.1 method/function to register a user
const registerUser = async (req, res, next) => {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("start of the register function "+req.files);

    // here we check if the req object has any files or not
    // ask rahul when will the control come here, why do we need this block of code ? 
    if(req.files && req.files.photo == null){
        // if no files are uploaded, we just return with the error message
        return next(new CustomError('Profile picture not provided properly', 400));
    }
    // destructure all required fields from req.body
    const {name, email, password} = req.body;
    if(!email||!name ||!password){
        return next(new CustomError("Name, Email and Password cannot be blank, all these fields are required ", 400));
    }
    //initialize an empty photoObject object
    let photoObject = {
    }
    //if the req object has any files
    if(req.files) {
        console.log(req.files.phot);
        let file = req.files.photo;
        console.log("File Object: "+file);
        console.log(file.tempFilePath);
        const result = await cloudinary.v2.uploader.uploadFile(file.tempFilePath, {
                folder:"users", 
                width: 150, 
                crop:"scale",
        })  
        console.log("Cloudinary upload Result Object: "+result);  
        photoObject = {
            id : result.public_id,
            secure_url : result.secure_url
        }
    } else {
        photoObject = null
    }
    //this result will hold the id and secure_url 
    //here we craete the user with req.body and hold the reference to the created user 
    await User.create({
        name,
        email,
        password,
        photo: photoObject
    });
    res.status(201).json({
        message: "User registered successfully",
        success: true,
    })
    console.log("register function ends here");
}
//1.2 action to signup a user, here we wrap our registerUser function inside asyncPromiseHandler
module.exports.signup = asyncPromiseHandler(registerUser);
    //-------------------------------------Register/Signup Ends here ++++++++++----------------------//
//2. controller to login a user
//2.1 method/function to login a user
const loginUser =  async (req, res, next)=>{

}
//2.2 action to login a user, here we wrap our loginUser function inside asyncPromiseHandler
module.exports.login = asyncPromiseHandler(loginUser);
    //-------------------------------------Login Ends here ++++++++++----------------------//
//3. controller to logout a user
//3.1 method/function to logout a user
const logoutUser =  async (req, res, next)=>{

}
//3.2 action to logout a user, here we wrap our logoutUser function inside asyncPromiseHandler
module.exports.logout = asyncPromiseHandler(logoutUser);
    //-------------------------------------Logout Ends here ++++++++++----------------------//