import {seniorModel, volunteerModel} from "../../Database/Model.js"

const isValidEmail = email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);



const formSubmissionMiddleware = {
    senior:{
           isAllDetails:(req,res,next)=>{
               const {email} = req.body;
   
               if(!email)
                   return res.status(404).json({status:false,message:"email number is required"})
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
               const userExists = await seniorModel.findOne({email:email,userverified:true})
               if(!userExists) 
                   return res.status(403).json({status:false,message:"senior does not exists with given email number"})
               next()
           }
       },
       volunteer:{
           isAllDetails:(req,res,next)=>{
               const {email} = req.body;
               if(!email)
                   return res.status(404).json({status:false,message:"email is required"})
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
               const userExistsSenior = await seniorModel.findOne({email:email,userverified:true})
               const userExistsVolunteer = await volunteerModel.findOne({email:email,userverified:true})
               if(userExistsSenior || userExistsVolunteer) 
                   return res.status(403).json({status:false,message:"this email id is arleady in use"})
               next()
           },
           isSubmitted:async (req,res,next)=>{
            const {email} = req.body;
            const userExistsVolunteer = await volunteerModel.findOne({email:email})
            if(userExistsVolunteer) 
                return res.status(403).json({status:false,message:"application arleady submitted"})
            next()
        }
       },
}

export default formSubmissionMiddleware;