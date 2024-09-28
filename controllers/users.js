const User = require('../models/userSchema')

// User login route to verify email and password
const userLogin = async(req, res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        // Send success response with the user's username
        res.status(200).json({ success: true, username: user.username });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
}

module.exports={userLogin}
