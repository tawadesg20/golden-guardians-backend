import {seniorModel, volunteerModel} from "../../Database/Model.js"
import { ObjectId } from "mongodb";
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


const formSubmission = {
    volunteer:{
        submit:async (req,res) => {
            const file = req.file; // File object
        let data = req.body; // Key-value pairs
    
        if (!file) {
            return res.status(400).json({ message: "File is required" });
        }
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
            });
            await volunteerModel.updateOne({email:data.email},{$set:{application:{resume:uploadedFile,data:data},applicationStatus:"Submitted"}})
          res.status(201).json({
            status:"Ok",
            message: 'Volunteer Application Form Submitted Successfully',
            
          });
        },
        get:async (req, res) => {
            try {
              const file = await gfsBucket
                .find({ filename: req.params.filename })
                .toArray()
                .then((files) => files[0]);
          
              if (!file) {
                return res.status(404).json({ error: 'File not found' });
              }
          
              // Stream the file to the response
              res.set('Content-Type', file.contentType);
              gfsBucket.openDownloadStream(file._id).pipe(res);
            } catch (err) {
              console.error(err);
              res.status(500).json({ error: 'Failed to retrieve file' });
            }
          }
    }
}

export default formSubmission;