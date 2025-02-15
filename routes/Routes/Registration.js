import {seniorModel, volunteerModel} from "../../Database/Model.js";
import otpGenerator from 'otp-generator';
import twilio from 'twilio';
import dotenv from "dotenv";
import sendOTPEmail from "../../sendOtp.js";
dotenv.config()

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const register ={
    senior:async (req,res) => {
        let {name,email,dob,address,emergencycontact,interests,services,specialneeds,city,zipcode,state} = req.body;

        if(!specialneeds)
            specialneeds = " ";

// Configure Twilio
const otp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });
const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await sendOTPEmail(email,otp)
    const userDetails = {name:name,email:email,dob:dob,address:address,emergencycontact:emergencycontact,interests:interests,city:city.trim().toLowerCase(),services:services,specialneeds:specialneeds,zipcode:zipcode,state:state,email:email,otp:otp,expiresAt:expiresAt,applicationStatus:"Not Submitted",userverified:false};
    await seniorModel.create(userDetails)
    return res.status(200).json({status:true,message:"otp sent in your email, submit to register"})
    },
    volunteer:async (req,res) => {
      let {name,address,emergencycontact,skills,availability,experience,email,city} = req.body;

      if(!experience)
        experience = " ";

      const otp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await sendOTPEmail(email,otp)
        
      const userDetails = {name:name,address:address,emergencycontact:emergencycontact,skills:skills,availability:availability,city:city.trim().toLowerCase(),experience:experience,email:email,otp:otp,expiresAt:expiresAt,userverified:false};
      await volunteerModel.create(userDetails)
      return res.status(200).json({status:true,message:"otp sent in your email, submit to register"})
}
}

export default register;