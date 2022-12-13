const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({});

//here users is the name of collection in the database, userSchema is the schema, User is the name of model.
const User = mongoose.model('users', userSchema);

module.exports = User;