import {seniorModel,volunteerModel} from "../../Database/Model.js";

const otpVerification = {
    senior:async (req,res)=>{
        const {email} = req.body;
          await seniorModel.updateOne({email:email},{$set:{userverified:true}})
                return res.status(200).json({ status:true, message: "otp verification successfully" });
    },
    volunteer:async (req,res)=>{
        const {email} = req.body;
          await volunteerModel.updateOne({email:email},{$set:{userverified:true}})
                return res.status(200).json({ status:true, message: "otp verification successfully" });
    }
}

export default otpVerification;