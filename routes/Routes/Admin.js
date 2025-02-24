import {volunteerModel,seniorModel} from "../../Database/Model.js";
const admin = {
    getApplications: async (req, res) => {
        let applications = await volunteerModel.find({});
        applications = applications.map((user) => {
            return {id:user.id,email: user.email, application: user.application,skills:user.skills,applicationStatus:user.applicationStatus};
        });
        return res.json({status: "OK", message: "Applications Retrieved successfully!", applications: applications});
    },
    getApplication: async (req, res) => {
        const {email} = req.body;
        let application = await volunteerModel.findOne({email:email});
        application = application.application
        return res.json({status: "OK", message: "Application Retrieved successfully!", application: application});
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
    },
    signIn: async (req, res) => {
        const {adminkey}   = req.body;
        // checks the adminKey exists and correct middleware
        if(!adminkey)
            return  res.status(400).json({status:"Not Ok",message:"Admin key is required"})
        if(adminkey != process.env.ADMIN_KEY)
            return res.status(400).json({status:"Not Ok",message:"Invalid admin key"})
        return res.status(200).json({status: "OK", message: "Admin signed in successfully!"});
    },
    getVolunteers: async (req, res) => {
        const {adminkey}   = req.params;
        // checks the adminKey exists and correct middleware
        if(!adminkey)
            return  res.status(400).json({status:"Not Ok",message:"Admin key is required"})
        if(adminkey != process.env.ADMIN_KEY)
            return res.status(400).json({status:"Not Ok",message:"Invalid admin key"})
        const volunteers =await volunteerModel.find({})
        return res.status(200).json({status: "OK", message: "Volunteers fetched successfully!",volunteers:volunteers});
    },
    assignTask: async (req, res) => {
        const {adminkey}   = req.params;
        const {semail,vemail,task,city,date,startTime,endTime} = req.body;
        // checks the adminKey exists and correct middleware
        if(!adminkey)
            return  res.status(400).json({status:"Not Ok",message:"Admin key is required"})
        if(!semail | !vemail || !task || !city || !date || !startTime || !endTime)
            return  res.status(400).json({status:"Not Ok",message:"semail or vemail or task or city or date or startTime or endTime is missing"})
        if(adminkey != process.env.ADMIN_KEY)
            return res.status(400).json({status:"Not Ok",message:"Invalid admin key"})
        await volunteerModel.updateOne({email:vemail},{$set:{senior:{email:semail,task:task,city:city,status:"Assigned",date:date,startTime:startTime,endTime:endTime}}})
        await seniorModel.updateOne({email:semail},{$set:{volunteer:{email:vemail,task:task,city:city,status:"Assigned",date:date,startTime:startTime,endTime:endTime}}})
        return res.status(200).json({status: "OK", message: "Task Assigned successfully!"});
    }
};

export default admin;