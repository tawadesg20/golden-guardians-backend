import {seniorModel, volunteerModel} from "../../Database/Model.js"

const matchAlgorithm ={
    senior: async (req,res) => {
        const {email } = req.body;
        const senior = await seniorModel.findOne({email:email});
        const volunteers = await volunteerModel.find();
        const matches = [];
    
        
            volunteers.forEach(volunteer => {
                // Check if the volunteer's skills match the senior's needs and locations are the same
                if (senior.interests.some(interest => volunteer.skills.includes(interest)) && senior.city === volunteer.city) {
                    matches.push({name:volunteer.name,email:volunteer.email,phone:volunteer.phone,skills:volunteer.skills});
                }
            });
    
        if(matches.length>0)
            return res.status(200).json({status:"Ok",message:"Matches",matches:matches})
        else
        return res.status(200).json({status:"Not Ok",message:"Match not found", matches:matches})
    },
    volunteer: async (req,res) => {
        const {email } = req.body;
        const volunteer = await volunteerModel.findOne({email:email});
        const seniors = await seniorModel.find();
        const matches = [];
    
            seniors.forEach(senior => {
                // Check if the volunteer's skills match the senior's needs and locations are the same
                if (volunteer.skills.some(skill => senior.interests.includes(skill)) && volunteer.city === senior.city) {
                    matches.push({name:senior.name,email:senior.email,phone:senior.phone,interests:senior.interests});
                }
            });
    
        if(matches.length>0)
            return res.status(200).json({status:"Ok",message:"Matches",matches:matches})
        else
        return res.status(200).json({status:"Not Ok",message:"Match not found", matches:matches})
    }
};

export default matchAlgorithm;