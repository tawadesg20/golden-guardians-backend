import {seniorModel, volunteerModel} from "../../Database/Model.js";
import otpGenerator from 'otp-generator';
import sendOTPEmail from "../../sendOtp.js";
import twilio from 'twilio';
import dotenv from "dotenv";
dotenv.config()

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const login ={
    senior:async (req,res) => {
        let {email} = req.body;

// Configure Twilio
const otp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });
  await sendOTPEmail(email,otp)
        await seniorModel.updateOne({email:email},{$set:{loginotp:otp,loginverified:false}})
        return res.status(200).json({status:true,message:"otp sent in your email, submit to register"})
    },
    volunteer:async (req,res) => {
        let {email} = req.body;

const otp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });
  await sendOTPEmail(email,otp)
        await volunteerModel.updateOne({email:email},{$set:{loginotp:otp,loginverified:false}})
        return res.status(200).json({status:true,message:"otp sent in your email, submit to register"})

    },
}

export default login;