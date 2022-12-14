const mongoose = require('mongoose');
const validator = require('validator');
const asyncPromiseHandler = require('../middlewares/asyncPromiseHandler');
const bcrypt = require('bcryptjs'); //for hashing the password field
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [40, 'Name must be at less than 40 characters'],
        trim: true, //this will remove the spaces from both ends of the name
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        validate: [validator.isEmail,'Please provide email in correct format'],
        unique: [true, 'Please provide a unique email, this email already exists'],
    }, 
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        trim: true, //this will remove the spaces from both ends of the password
        select: false, //whenever we query the user model, the model will not return a password
    },
    role: {
        type: String,
        default:"user",//by deault any user created will have the user role. 
        //the role will be changed from admin via a dropdown list which will have admin, managers, user.
        // enum: ["user", "admin", "managers", "user"],

    },
    isAdmin: {
        type: Boolean,
        default: false, //by default any user craeted will nt be admin, admin rights can be set from the frontend
        enum: [true, false] //at the frontend you will have option to choose true or false
    },
    photo: {
        //here photo is an object with required false,
        //when we create a user, you dont need a photo,photo is not required for creating a user
        //but to upload a photo, you need both the fields id and secure_url
        //here the photo is an object, with fields like id, secure_url which we will get from cloudinary
        type: Object,
        required: false, 
        id: {
            type: String, 
            required: true
        }, 
        secure_url: {
            type: String,
            required: true 
        }
    }, 
    forgotPasswordToken: String, 
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date, 
        default: Date.now, //we want this field to be executed whenever the user is created
    },
});

//encrypt the password before save -- HOOKS 
userSchema.pre('save', function (next) {
    const user = this;
    //only if the password field is modified, we need to hash it,
    //this will be true only when we create a user and forgot password
    if (user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password, 10);
    }
    //call the next function in the call stack
    next();
});

//methods on the userSchema
//ask rahul, why are we not using static here ? what is the difference if we write static
//1.validate the password stored in database with password sent in by user
userSchema.methods.validatePassword = async function(userSentPassword) {
    return await bcrypt.compare(userSentPassword, this.password);
    //this method returns a simple true and false.
    //in case any error is returned by async function, asyncPromiseHandler will catch and handle the error
}

//2.create and return the jwtToken for the user
userSchema.methods.getJwtToken = function() {
    const token = jwt.sign({id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY*24*60*60*1000,
});
console.log("Jwt Token Creation: "+ token);
    return token;
}
//3.generate forgot password token (just generate a random string)
userSchema.methods.getForgotPasswordToken = function() {
    // generate a long and random string
    const forgotPasswordToken = crypto.randomBytes(20).toString('hex');
    // we are now hashing the forgotPasswordToken with sha256 algorithm
    // ask rahul meaning of this code
    // getting a hash - make sure to get a hash on backend. 
    // ask rahul meaning of digest
    const forgotPasswordTokenHash = crypto.createHash('sha256').update(forgotPasswordToken).digest('hex');
    // here we are storing the hash in the backend but we are sending forgotPasswordToken to the user on the frontend
    this.forgotPasswordToken = forgotPasswordTokenHash;

    // expiry time for this token, 
    this.forgotPasswordExpiry = Date.now() + process.env.FORGOT_PASSWORD_EXPIRY*60*1000
    // from the time the token was generated, we are keeping the expiry time for 20 minutes
    // here we are returning forgotPasswordToken and not the hashed-forgotPasswordToken
    // when you get the forgotPasswordToken, from the frontend you need to run crypto hash on the token and then compare it with value stored in the backend.
    return forgotPasswordToken;

} 


//here users is the name of collection in the database, userSchema is the schema, User is the name of model.
const User = mongoose.model('users', userSchema);

module.exports = User;