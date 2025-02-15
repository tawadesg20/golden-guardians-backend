import {seniorModel, volunteerModel} from "../../Database/Model.js";
import dotenv from "dotenv";
dotenv.config();

const isValidEmail = email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const adminMiddleware = {
    isAllDetails: (req, res, next) => {
        const {adminkey} = req.params;
        const {email, type} = req.body;
        if (!adminkey || !email || !type)
            return res.status(404).json({status: false, message: "admin key or email or type  is not found"});
        next();
    },
    isCorrectDetails: (req, res, next) => {
        const {adminkey} = req.params;
        const {email, type} = req.body;
        if (adminkey != process.env.ADMIN_KEY || (type != "volunteer" && type != "senior") || !isValidEmail(email))
            return res.status(404).json({status: false, message: "invalid admin key or invalid type or email"});
        next();
    },
    isemailNumber: async (req, res, next) => {
        const {email,type} = req.body;
        if (!email)
            return res.status(400).json({status: false, message: "email is required"});
        if (type == "volunteer") {
                const volunteer = await volunteerModel.findOne({email: email});
                if (!volunteer)
                    return res.status(404).json({status: false, message: "volunteer not found"});
        }
        if (type == "senior") {
            const senior = await seniorModel.findOne({email: email});
            if (!senior)
                return res.status(404).json({status: false, message: "senior not found"});
    }
        next();
    },
};

export default adminMiddleware;