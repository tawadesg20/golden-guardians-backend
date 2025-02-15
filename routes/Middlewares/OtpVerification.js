import {seniorModel,volunteerModel} from "../../Database/Model.js";


const isValidEmail = email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);


const otpVerificationMiddleware = {
    senior:{
        isAllDetails:(req,res,next)=>{
            const {email,otp} = req.body;
            const errors = {};

            if(!email) errors.email="email number is required";
            if(!otp) errors.otp="otp is required";
    
            if(!email || !otp)
                return res.status(404).json({status:false,message:errors})
            next()
        },
        isCorrectDetails:(req,res,next)=> {
           const {email} = req.body;
           if(!isValidEmail(email))
            return res.status(404).json({status:false,message:"invalid email number"})
          next()  
        },
        isNotExists:async (req,res,next)=>{
            const {email} = req.body;
            const userAlreadyVerified = await seniorModel.findOne({email:email,userverified:true})
            if(userAlreadyVerified)
                return res.status(401).json({status:false,message:"user already verified"})
            const userExists = await seniorModel.findOne({email:email})
            if(!userExists)
                return res.status(401).json({status:false,message:"user not exists with given email number"})
            next()
        },
        isCorrectOtp:async (req,res,next)=>{
            const {email,otp} = req.body;
            const correctOtp = await seniorModel.findOne({email:email,otp:otp})
            if(!correctOtp)
                return res.status(401).json({status:false,message:"incorrect otp, submit again"})
            next()
        },
        isOtpNotExpired:async (req,res,next)=>{
            const {email} = req.body;
            const user = await seniorModel.findOne({email:email})
            if(user.expiresAt < Date.now())
                return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
            next()
        }
    },
    volunteer:{
        isAllDetails:(req,res,next)=>{
            const {email,otp} = req.body;
            const errors = {};

            if(!email) errors.email="email number is required";
            if(!otp) errors.otp="otp is required";
    
            if(!email || !otp)
                return res.status(404).json({status:false,message:errors})
            next()
        },
        isCorrectDetails:(req,res,next)=> {
           const {email} = req.body;
           if(!isValidEmail(email))
            return res.status(404).json({status:false,message:"invalid email number"})
          next()  
        },
        isNotExists:async (req,res,next)=>{
            const {email} = req.body;
            const userAlreadyVerified = await volunteerModel.findOne({email:email,userverified:true})
            if(userAlreadyVerified)
                return res.status(401).json({status:false,message:"user already verified"})
            const userExists = await volunteerModel.findOne({email:email})
            if(!userExists)
                return res.status(401).json({status:false,message:"vounteer does not exists with given email number"})
            next()
        },
        isCorrectOtp:async (req,res,next)=>{
            const {email,otp} = req.body;
            const correctOtp = await volunteerModel.findOne({email:email,otp:otp})
            if(!correctOtp)
                return res.status(401).json({status:false,message:"incorrect otp, submit again"})
            next()
        },
        isOtpNotExpired:async (req,res,next)=>{
            const {email} = req.body;
            const user = await volunteerModel.findOne({email:email})
            if(user.expiresAt < Date.now())
                return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
            next()
        }
    }
}

export default otpVerificationMiddleware;