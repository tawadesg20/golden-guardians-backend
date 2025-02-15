import {seniorModel,volunteerModel} from "../../Database/Model.js";


const isValidEmail = email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);


const registerMiddleware = {
    senior:{
        isAllDetails:(req,res,next)=>{
            const {name,email,dob,address,emergencycontact,interests,services,city,zipcode,state} = req.body;
            const errors = {};
            if(!name) errors.name="name is required";
            if(!email) errors.email="email is required";
            if(!dob) errors.dob="DOB is required";
            if(!address) errors.address="address is required";
            if(!zipcode) errors.zipcode="zipcode is required";
            if(!state) errors.state="state is required";
            if(!emergencycontact) errors.emergencycontact="emergency contact is required";
            if(!interests) errors.interests="interests is required";
            if(!services) errors.services="services is required";
            if(!city) errors.city = "city is required";
    
            if(!(name && email && dob && address && emergencycontact && interests && city))
                return res.status(404).json({status:false,message:errors})
            next()
        },
        isCorrectDetails:(req,res,next)=> {
           const {email} = req.body;
           if(!isValidEmail(email))
            return res.status(404).json({status:false,message:"invalid email number"})
          next()  
        },
        isExists:async (req,res,next)=>{
            const {email} = req.body;
            const seniorExists = await seniorModel.findOne({email:email,userverified:true})
            const volunteerExists = await volunteerModel.findOne({email:email,userverified:true})
            await seniorModel.deleteMany({email:email,userverified:false})
            await volunteerModel.deleteMany({email:email,userverified:false})
            if(seniorExists || volunteerExists) 
                return res.status(403).json({status:false,message:"email number already exists"})
            next()
        }
    },
    volunteer:{
        isAllDetails:(req,res,next)=>{
            const {name,email,address,emergencycontact,skills,availability,city,zipcode,state} = req.body;
            const errors = {};
            if(!name) errors.name="name is required";
            if(!email) errors.email="email is required";
            if(!address) errors.address="address is required";
            if(!zipcode) errors.zipcode="zipcode is required";
            if(!state) errors.state="state is required";
            if(!emergencycontact) errors.emergencycontact="emergency contact is required";
            if(!skills) errors.skills="skills is required";
            if(!availability) errors.availability="avaialability is required";
            if(!city) errors.city = "city is required";
    
            if(!(name && email  && address && emergencycontact && skills && availability && city))
                return res.status(404).json({status:false,message:errors})
            next()
        },
        isCorrectDetails:(req,res,next)=> {
           const {email} = req.body;
           if(!isValidEmail(email))
            return res.status(404).json({status:false,message:"invalid email number"})
          next()  
        },
        isExists:async (req,res,next)=>{
            const {email} = req.body;
            const seniorExists = await seniorModel.findOne({email:email,userverified:true})
            const volunteerExists = await volunteerModel.findOne({email:email,userverified:true})
            await seniorModel.deleteMany({email:email,userverified:false})
            await volunteerModel.deleteMany({email:email,userverified:false})
            if(seniorExists || volunteerExists) 
                return res.status(403).json({status:false,message:"email number already exists"})
            next()
        }
    }
}

export default registerMiddleware;