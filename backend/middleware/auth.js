const jwt = require('jsonwebtoken');
const User = require('../models/userDetails');

const authenticate =async (req,res,next) =>{
    try{
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token is missing' });
        }
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const user = await User.findByPk(decodedToken.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });

        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

module.exports = {
    authenticate
}