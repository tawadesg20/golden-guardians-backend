import {seniorModel,volunteerModel} from "../../Database/Model.js";

const loginVerify = {
    senior:async (req,res)=>{
        const {email} = req.body;
        await seniorModel.updateOne({email:email},{$set:{loginverified:true}})
        const senior = await seniorModel.findOne({email:email})
                return res.status(200).json({ status:true, message: "otp verification successfully",user:senior });
    },
    volunteer:async (req,res)=>{
        const {email} = req.body;
          await volunteerModel.updateOne({email:email},{$set:{loginverified:true}})
        const volunteer = await volunteerModel.findOne({email:email})
                return res.status(200).json({ status:true, message: "otp verification successfully",user:volunteer });
    }
}

export default loginVerify;