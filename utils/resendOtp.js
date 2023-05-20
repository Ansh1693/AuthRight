const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
const sendOtp= require('./otp');

const resendOtp = async (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({
            status: false,
            message: error
        })
    }
    const email = req.body.email;
    const type=req.body.type;
    try{
        const otpCheck = await Otp.findOne({user: email});
        if(!otpCheck){
            return res.status(400).json({status: false , message :'Otp not found'});
        }
        if(otpCheck.used){
            return res.status(400).json({status: false , message: 'Otp already used'});
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
            return res.status(400).json({status: false , message: ans.message})
        }else{
            res.status(200).json({status: true ,message: 'Otp sent successfully'});
        }

    }catch(error){
        res.status(400).json({status: false , message: error.message});
    }
}

module.exports= resendOtp;