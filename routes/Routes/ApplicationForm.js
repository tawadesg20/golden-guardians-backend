import {seniorModel, volunteerModel} from "../../Database/Model.js";

const applicationForm = async (req,res) =>{
    const {application,email} = req.body;
    await volunteerModel.updateOne({email:email},{application:application})
    return res.json({status:"Ok",message:"Application form submitted successfully"})
}

export default applicationForm;