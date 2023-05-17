const mongoose=require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const secret= "Iwillbeagoodprogrammer"
const {getCookie} = require('./verifyOtp')

exports.login = async function(req, res) {
    try {
        const { username , email, password } = req.body;
        const userCheck = await User.findOne({ username: username});
        if(userCheck){
            const validPass = await bcrypt.compare(password, userCheck.password);
            if(validPass){
                
                    const {token,options}= getCookie(userCheck.email);
                    res.status(200).json({
                        success: true,
                        userCheck,
                        authToken: token
                    });
            }else{
                res.status(400).send('Invalid password');
            }
        }
        const emailCheck = await User.findOne({email: email}); 
        if(emailCheck){
            const validPass = await bcrypt.compare(password, emailCheck.password);
            if(validPass){
                    const {token,options}= getCookie(emailCheck.email);
                    res.status(200).json({
                        success: true,
                        emailCheck,
                        authToken: token
                    });

            }else{
                res.status(400).send('Invalid password');
            }
        }

        if(!userCheck && !emailCheck) res.status(400).send('Invalid username or email');

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}




