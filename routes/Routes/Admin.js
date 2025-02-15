import {volunteerModel,seniorModel} from "../../Database/Model.js";
const admin = {
    getApplications: async (req, res) => {
        let applications = await volunteerModel.find({});
        applications = applications.map((user) => {
            return {email: user.email, application: user.application};
        });
        return res.json({status: "OK", message: "Applications Retrieved successfully!", applications: applications});
    },
    getApplication: async (req, res) => {
        const {email} = req.body;
        let application = await volunteerModel.findOne({email:email});
        application = application.application
        return res.json({status: "OK", message: "Application Retrieved successfully!", applications: application});
    },
    
    approveApplication: async (req, res) => {
        const {email,type} = req.body;
        if (type == "volunteer") {
            await volunteerModel.updateOne({email: email}, {$set: {applicationStatus: "Accepted"}});
        } else if (type == "senior") {
            await seniorModel.updateOne({email: email}, {$set: {applicationStatus: "Accepted"}});
        }
        return res.json({status: "OK", message: "Applications Approved successfully!"});
    },
    rejectApplication: async (req, res) => {
        const {email,type} = req.body;
        if (type == "volunteer") {
            await volunteerModel.updateOne({email: email}, {$set: {applicationStatus: "Rejected"}});
        } else if (type == "senior") {
            await seniorModel.updateOne({email: email}, {$set: {applicationStatus: "Rejected"}});
        }
        return res.json({status: "OK", message: "Applications Rejected successfully!"});
    }
};

export default admin;