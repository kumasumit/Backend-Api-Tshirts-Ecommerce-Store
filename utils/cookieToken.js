const cookieToken = (user, res) => {
    const token = user.getJwtToken();
    if(token){
    //now we create some options to pass in the cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRY*24*60*60*1000 //here we are expiring the cookie 3days after it is created
        ),
        httpOnly: true,
    }
    user.password = undefined; // we are doing this so that when we get the user the password does not show there
    return res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user //here the user that we return does not contain the password
    })
    }
};



module.exports = cookieToken;