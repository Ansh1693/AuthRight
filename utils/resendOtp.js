const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
const sendOtp= require('./otp');

const resendOtp = async (req,res)=>{
    const email = req.body.email;
    const type=req.body.type;
    try{
        const otpCheck = await Otp.findOne({user: email});
        if(!otpCheck){
            return res.status(400).send('Otp not found');
        }
        if(otpCheck.used){
            return res.status(400).send('Otp already used');
        }
        await otpCheck.deleteOne();
        
        var format;
        if(type=='signup'){
            format = "Your otp for verification is: ";
        }else if(type=='forgot'){
            format = "Your otp to reset your password is: ";
        }

        const ans = await sendOtp(email, format);

        if(ans.status == 400){
            return res.status(400).json({message: ans.message})
        }else{
            res.status(200).json({message: 'Otp sent successfully'});
        }

    }catch(error){
        res.status(400).send(error.message);
    }
}

module.exports= resendOtp;