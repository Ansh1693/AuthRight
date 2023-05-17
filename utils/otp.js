var nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const User = require('../models/user.js')
const mongoose = require('mongoose')
const Otp = require('../models/Otp.js')

const sendOtp = async(email,format) => {

  const emailuser = email;
  try{
    const otpgenerated= otpGenerator.generate(4, { upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });
    
    console.log(otpgenerated);
  
    var transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "ansh.goyal.12a.7@gmail.com",
      pass: "fbdevakdopiqyisa"
    },
    tls: {
      rejectUnauthorized: true
    }
  });
  
  
  var mailOptions = {
    from: '"Ansh" <ansh.goyal.12a.7@gmail.com>',
    to: emailuser,
    subject: 'Nice Nodemailer test',
    text:`Hey there, ${format} : ${otpgenerated}`,
    html: `<b>Hey there! </b>${format} : ${otpgenerated}`,
    
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return {status: 400, message: error.message};
    }
    // console.log(info);
    console.log('Message sent: %s', info.messageId);
  });
  
  
  const otp = new Otp({
    otp: otpgenerated,
    user: emailuser,
    expiresAt: new Date(Date.now() + 3600*1000),
  });
  const savedOtp = await otp.save();
  if(!savedOtp){
    return {status: 400, message: 'Otp not saved'};
  } 
  
  return {status: 200, message: 'Otp sent successfully'};
}catch(error){
  return {status: 400, message: error.message};
}
}


  
module.exports = sendOtp;
