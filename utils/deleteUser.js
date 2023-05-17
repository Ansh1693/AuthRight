// const { findOneAndDelete } = require('../models/Otp');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const deleteUser = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    try {
        var user = await User.findOne({ email: email });
        // const user = await User.findByIdAndDelete(req.params.id);
        if(!user) {
            user = await User.findOne({ username: username });
            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        await user.deleteOne();
        
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = deleteUser;