const mongoose = require('mongoose');

// User schema for authentication
const UserSchema = new mongoose.Schema({
    email: String,
    password: String, // Storing passwords as plain text is not recommended in production
    username: String
});
const User = mongoose.model('User', UserSchema);

module.exports= User
