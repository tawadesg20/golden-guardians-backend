import {seniorModel,volunteerModel} from "../../Database/Model.js";


const isValidEmail = email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidPhone = (num) => /^[0-9]{10}$/.test(num);
const isSixtyOrOlder = (dob) => (new Date().getFullYear() - new Date(dob).getFullYear()) >= 60;

const registerMiddleware = {
    senior:{
        isAllDetails:(req,res,next)=>{
            const {name,email,dob,address,emergencycontact,interests,services,city,zipcode,state,phone} = req.body;
            const errors = {};
            if(!name) errors.name="name is required";
            if(!email) errors.email="email is required";
            if(!phone) errors.phone="phone is required";
            if(!dob) errors.dob="DOB is required";
            if(!address) errors.address="address is required";
            if(!zipcode) errors.zipcode="zipcode is required";
            if(!state) errors.state="state is required";
            if(!emergencycontact) errors.emergencycontact="emergency contact is required";
            if(!interests) errors.interests="interests is required";
            if(!services) errors.services="services is required";
            if(!city) errors.city = "city is required";
    
            if(!(name && email && dob && address && emergencycontact && interests && city && phone))
                return res.status(404).json({status:false,message:errors})
            next()
        },
        isCorrectDetails:(req,res,next)=> {
           const {email,phone,dob} = req.body;
           if(!isValidEmail(email))
            return res.status(404).json({status:false,message:"invalid email id"})
           if(!isValidPhone(phone))
            return res.status(404).json({status:false,message:"invalid phone number"})
           if(!isSixtyOrOlder(dob))
            return res.status(404).json({status:false,message:"DOB is less than 60, you are not senior"})
          next()  
        },
        isExists:async (req,res,next)=>{
            const {email,phone} = req.body;
            const seniorExistsEmail = await seniorModel.findOne({email:email,userverified:true})
            const seniorExistsPhone = await seniorModel.findOne({phone:phone,userverified:true})
            const volunteerExistsEmail = await volunteerModel.findOne({email:email,userverified:true})
            const volunteerExistsPhone = await volunteerModel.findOne({phone:phone,userverified:true})
            await seniorModel.deleteMany({email:email,userverified:false})
            await volunteerModel.deleteMany({email:email,userverified:false})
            if(seniorExistsEmail || volunteerExistsEmail) 
                return res.status(403).json({status:false,message:"email id already exists"})
            if(seniorExistsPhone || volunteerExistsPhone) 
                return res.status(403).json({status:false,message:"phone number already exists"})
            next()
        }
    },
    volunteer:{
        isAllDetails:(req,res,next)=>{
            const {name,email,address,emergencycontact,skills,availability,city,zipcode,state,phone} = req.body;
            const errors = {};
            if(!name) errors.name="name is required";
            if(!email) errors.email="email is required";
            if(!phone) errors.phone="phone is required";
            if(!address) errors.address="address is required";
            if(!zipcode) errors.zipcode="zipcode is required";
            if(!state) errors.state="state is required";
            if(!emergencycontact) errors.emergencycontact="emergency contact is required";
            if(!skills) errors.skills="skills is required";
            if(!availability) errors.availability="avaialability is required";
            if(!city) errors.city = "city is required";
    
            if(!(name && email  && address && emergencycontact && skills && availability && city && phone))
                return res.status(404).json({status:false,message:errors})
            next()
        },
        isCorrectDetails:(req,res,next)=> {
           const {email,phone} = req.body;
           
           if(!isValidEmail(email))
            return res.status(404).json({status:false,message:"invalid email number"})
           if(!isValidPhone(phone))
            return res.status(404).json({status:false,message:"invalid phone number"})
          next()  
        },
        isExists:async (req,res,next)=>{
            const {email,phone} = req.body;
            const seniorExistsEmail = await seniorModel.findOne({email:email,userverified:true})
            const seniorExistsPhone = await seniorModel.findOne({phone:phone,userverified:true})
            const volunteerExistsEmail = await volunteerModel.findOne({email:email,userverified:true})
            const volunteerExistsPhone = await volunteerModel.findOne({phone:phone,userverified:true})
            await seniorModel.deleteMany({email:email,userverified:false})
            await volunteerModel.deleteMany({email:email,userverified:false})
            if(seniorExistsEmail || volunteerExistsEmail) 
                return res.status(403).json({status:false,message:"email id already exists"})
            if(seniorExistsPhone || volunteerExistsPhone) 
                return res.status(403).json({status:false,message:"phone number already exists"})
            next()
        },
        isAccepted:async (req,res,next)=>{
            const {email,phone} = req.body;
            const volunteerExistsEmail = await volunteerModel.findOne({email:email})
            if(!volunteerExistsEmail) 
                return res.status(403).json({status:false,message:"email not exists"})
            if(volunteerExistsEmail.applicationStatus!="Accepted")
                return res.status(403).json({status:false,message:"your application is not accepted yet"})
            next()
        },
    }
}

export default registerMiddleware;