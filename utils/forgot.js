const sendOtp = require('./otp');
const User = require('../models/user');
const Otp = require('../models/Otp');
const {verifyOtp } = require('./verifyOtp');
const bcrypt = require('bcryptjs');
const {validationResult}= require('express-validator');

const getOtp = async(req,res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({
            status: false,
            message: error
        })
    }
    const email = req.body.email;
    try{
        const emailCheck = await User.findOne({email: email});
        console.log(emailCheck)
        if(!emailCheck){
            return res.status(400).json({status: false , message:'Email not found'});
        }
        const ans = await sendOtp(email, "Your otp to reset your password is: ");
        if(ans.status == 400){
            return res.status(400).json({status: false,message: ans.message})
        }else{
            res.status(200).json({status: true ,message: 'Otp sent successfully'});
        }  

    }catch(err){
        res.status(400).json({status: false,message: err.message});
    }
}

const verifyForgot = async(req,res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({
            status: false,
            message: error
        })
    }

    const email = req.body.email;
    const otp = req.body.otp;
    try{
        const ans = await verifyOtp(email, otp);
        if(ans.status == 400){
            return res.status(400).json({status: false , message: ans.message});
        }else{
            res.status(200).json({status: true, message: 'Otp verified successfully'});
        }
    }catch(err){
        res.status(400).json({status: false , message: err.message});
    }
}

const setNewPassword = async(req,res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({
            status: false,
            message: error
        })
    }
    
    const email = req.body.email;
    const password = req.body.password;
    try{
        const emailCheck = await User.findOne({email: email});
        if(!emailCheck){
            return res.status(400).json({status: false , message:'Email not found'});
        }

        const otpCheck = await Otp.findOne({user: email});
        if(!otpCheck.used){
            return res.status(400).json({status: false , message:'Otp not Verified'});
        }
        // await Otp.findOneAndDelete({user: email});
        await otpCheck.deleteOne();
        const hashedPassword = await bcrypt.hash(password, 10);

        emailCheck.password = hashedPassword;
        await emailCheck.save();
        res.status(200).json({status: true , message:'Password changed successfully'});
    }catch(err){
        res.status(400).json({status: false , message:err.message});
    }
}

module.exports = {getOtp, verifyForgot, setNewPassword};