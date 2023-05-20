const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendOtp = require("./otp");
const { verifyOtp, getCookie } = require("./verifyOtp");
const Otp= require('../models/Otp')
const {validationResult} = require("express-validator")
exports.signup = async function (req, res) {
  const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({
            status: false,
            message: error
        })
    }
  const { username, email, password } = req.body;
  try {
    const nameCheck = await User.findOne({ username: username });
    if (nameCheck) {
      return res.status(400).json({status : false , message: "Username already exists"});
    }

    const emailCheck = await User.findOne({ email: email });
    if (emailCheck) {
      return res.status(400).json({status : false , message: "Email already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    const ans = sendOtp(email, "Your otp for verification is: ");
    if (ans.status == 400) {
      return res.status(400).json({status: false , message: ans.message});
    } else {
      res.status(200).json({
        success: true,
        message: "User created successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verify = async function (req, res) {

  const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({
            status: false,
            message: error
        })
    }
    
  const email = req.body.email;
  const otp = req.body.otp;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({status: false , message:"Email not found"});
    }
    // const otpCheck = await Otp.findOne(user.otp);
    if (user.verified == true) {
      return res.status(400).json({status: false , message: "Email already verified"});
    }

    const ans = await verifyOtp(email, otp);
    console.log(ans);
    if (ans.status == 400) {
      res.status(400).json({status: false , message: ans.message});
    }else{
        user.verified = true;
        await user.save();
        await Otp.findOneAndDelete({user: email});
        const { token, options } = getCookie(email);
        res.status(200).json({
            success: true,
            token: token,
            user:{
                username: user.username,
                email: user.email,
                verified: user.verified,
            },
        });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};



