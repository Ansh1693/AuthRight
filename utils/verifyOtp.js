require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret= process.env.SECRET;

const User = require('../models/user');
const Otp = require('../models/Otp');


const verifyOtp = async(email,otp) => {
    try{
  
      // const emailCheck = await User.findOne({email: email});

      const otpCheck = await Otp.findOne({user: email});
      // console.log(otpCheck, emailCheck);
      if(!otpCheck){
        return {status: 400, message: 'Otp not found'};
      }
  
      if(otpCheck.otp!=otp){
        return {status: 400, message: 'Otp incorrect'};
      }
  
      if(otpCheck.expiresAt<Date.now()){
        return {status: 400, message: 'Otp expired'};
      }
      otpCheck.used = true;
      await otpCheck.save();
      return {status: 200, message: 'Otp verified successfully'};
  
    }catch(err){
      return {status: 400, message: err.message}
    }
  
  }

function getCookie(email){
    const user = {email: email};
    const token = Token(user);
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    return {token, options};
}
  function Token(user) {
    return jwt.sign(user, secret);
}

module.exports= {verifyOtp , getCookie}