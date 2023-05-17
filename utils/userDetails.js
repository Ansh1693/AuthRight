const authoriseToken = require('../middleware/authorizeToken');
const User = require('../models/user');


const getDetails = async (req, res) => {
    try {
        console.log(req.user)
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(400).send("User not found");
        }
        res.status(200).json({
            success: true,
            user:{
                username: user.username,
                email: user.email,
                verified: user.verified,
            },});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = getDetails;