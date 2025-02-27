import {volunteerModel,seniorModel} from "../../Database/Model.js";
import { ObjectId } from "mongodb";
import {sendMessageEmail} from "../../sendOtp.js";
import dotenv from "dotenv";
dotenv.config()

import mongoose from "mongoose";
import multer from "multer";
import { GridFSBucket } from "mongodb";

let conn;
let gfsBucket;
const storage = multer.memoryStorage();
const upload = multer({ storage });
let mongoURI;

mongoURI = process.env.MONGO_URL;

let InitializeGridFS = (mongoUrl,collectionName) =>{
  mongoURI = mongoUrl; // Replace with your MongoDB URI
  // Connect to MongoDB
mongoose.connect(mongoURI,{
  useNewUrlParser: true,
    useUnifiedTopology: true,
});
conn = mongoose.connection;

conn.once('open', () => {
  gfsBucket = new GridFSBucket(conn.db, {
    bucketName: collectionName, // Collection name where files will be stored
  });
  console.log('Connected to MongoDB and GridFS!');
});
}

let returnUploadArray = (filesName,fileLength) => {
  return upload.array(filesName,fileLength)
}

InitializeGridFS(mongoURI,"volunteerResumes")


const volunteer ={
  request:  async (req,res) => {
    const {volunteerEmail,seniorEmail} = req.body;
    if(!volunteerEmail || !seniorEmail)
        return res.status(400).status({status:"Not Ok",message:"Email is required"})
      let curTime = new Date();
    await seniorModel.updateOne({email:seniorEmail},{$set:{volunteer:{email:volunteerEmail,task:"",status:"Requested",reqTime:curTime}}})
    await volunteerModel.updateOne({email:volunteerEmail},{$set:{senior:{email:seniorEmail,task:"",status:"Requested",reqTime:curTime}}})
    const volunteer = await volunteerModel.findOne({email:volunteerEmail})
    return res.status(200).json({status:"Ok",message:"Requested Successfully",volunteer:volunteer})
},
    get: async (req,res) => {
        const {email} = req.params;
        if(!email)
            return res.status(400).status({status:"Not Ok",message:"Email is required"})
        const volunteer = await volunteerModel.findOne({email:email})
        return res.status(200).json({status:"Ok",message:"Volunteer Fetched Successfully",volunteer:volunteer})
    },
    getSenior: async (req,res) => {
      const {email} = req.params;
      if(!email)
          return res.status(400).status({status:"Not Ok",message:"Email is required"})
      const senior = await seniorModel.findOne({email:email})
      return res.status(200).json({status:"Ok",message:"Senior Fetched Successfully",senior:senior})
  },
    save:async (req,res) => {
        const {email} = req.params;
        if(!email)
            return res.status(400).status({status:"Not Ok",message:"Email is required"})
        const file = req.file; // File object
                let data = req.body; // Key-value pairs
            
                if (file) {

                    const volunteerResumeExists = await gfsBucket.find({ filename: new RegExp(data.email) }).toArray();
        
                if (volunteerResumeExists.length) {
                  await gfsBucket.delete(new ObjectId(volunteerResumeExists[0]._id));
                }
            
                let uploadedFile = {}
                  // Stream each file to GridFS  
                    const writeStream = gfsBucket.openUploadStream(file.originalname+`-${data.email}`, {
                      contentType: file.mimetype, // Store MIME type of the file
                    });
                    writeStream.end(file.buffer);
              
                    await new Promise((resolve, reject) => {
                      writeStream.on('finish', () => {
                        // uploadedFile = { filename: file.originalname+`-${data.email}`, fileId: writeStream.id, link:req.headers.host+"/volunteer/application/"+file.originalname+`-${data.email}`+`?secretkey=${process.env.SECRET_KEY}` };
                        uploadedFile = { filename: file.originalname+`-${data.email}`, fileId: writeStream.id, link:req.headers.host+"/volunteer/application/"+file.originalname+`-${data.email}`};
                        resolve();
                      });
                      writeStream.on('error', (err) => reject(err));
                    })
                    await volunteerModel.updateOne({email:data.email},{$set:{name:req.body.name,address:req.body.address,city:req.body.city,state:req.body.state,zipcode:req.body.zipcode,skills:req.body.skills,hobbies:req.body.hobbies,certification:req.body.certification,experience:req.body.experience,"application.resume":uploadedFile}})
                }
                else
                await volunteerModel.updateOne({email:data.email},{$set:{name:req.body.name,address:req.body.address,city:req.body.city,state:req.body.state,zipcode:req.body.zipcode,skills:req.body.skills,hobbies:req.body.hobbies,certification:req.body.certification,experience:req.body.experience}})
        return res.status(200).json({status:"Ok",message:"Volunteer Updated Successfully"})
    },
    saveSenior:async (req,res) => {
      const {email} = req.params;
      if(!email)
          return res.status(400).status({status:"Not Ok",message:"Email is required"})
              let data = req.body; // Key-value pairs
              console.log(req.body)
          await seniorModel.updateOne({email:email},{$set:{name:req.body.name,address:req.body.address,city:req.body.city,state:req.body.state,zipcode:req.body.zipcode,interests:req.body.interests,specialneeds:req.body.specialneeds,emergencycontact:{emergencyContactName:req.body.ename,emergencyContactPhone:req.body.ephone,emergencyContactRelation:req.body.erelation}}})
      return res.status(200).json({status:"Ok",message:"Senior Updated Successfully"})
  },
  sendMail:async (req,res) => {
    const {email,name,message} = req.body;
    if(!email || !name || !message)
        return res.status(400).status({status:"Not Ok",message:"Email,Name or Message is required"})
         sendMessageEmail(email,`Name:${name}\nEmail:${email}\nMessage:${message}`)
    return res.status(200).json({status:"Ok",message:"Message Sent Successfully"})
},
}

export default volunteer;