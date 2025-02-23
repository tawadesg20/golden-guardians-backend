import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

import registerMiddleware from './routes/Middlewares/Registration.js';
import otpVerificationMiddleware from './routes/Middlewares/OtpVerification.js';
import loginMiddleware from './routes/Middlewares/Login.js';
import loginVerifyMiddleware from './routes/Middlewares/loginVerify.js';
import applicationFormMiddleware from './routes/Middlewares/ApplicationForm.js';
import adminMiddleware from './routes/Middlewares/Admin.js';
import matchingAlgorithmMiddleware from './routes/Middlewares/matchingAlgorithm.js';
import formSubmissionMiddleware from './routes/Middlewares/formSubmission.js';

import register from './routes/Routes/Registration.js';
import otpVerification from './routes/Routes/OtpVerification.js';
import login from './routes/Routes/Login.js';
import loginVerify from './routes/Routes/loginVerify.js';
import applicationForm from './routes/Routes/ApplicationForm.js';
import admin from './routes/Routes/Admin.js';
import matchAlgorithm from './routes/Routes/matchingAlgorithm.js';
import formSubmission from './routes/Routes/formSubmission.js';
import volunteer from './routes/Routes/volunteer.js';
const PORT = 5000;

const storage = multer.memoryStorage(); // Store file in memory (or use diskStorage for saving on disk)
const upload = multer({ storage: storage });

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.get("/getData", (req, res) => {
  res.send("Hello World");
});

// app.use((req,res,next) => {
//   const sk = req.query.secretkey
//   if(!sk || sk!==process.env.SECRET_KEY) 
//     return res.status(401).json({status:"Not Ok",message:"Invalid key user"})
//   next()
// })

//registration for senior
app.post("/register/senior", registerMiddleware.senior.isAllDetails,registerMiddleware.senior.isCorrectDetails,registerMiddleware.senior.isExists,register.senior);

//otp verification after senior registration
app.post("/otp-verify/senior", otpVerificationMiddleware.senior.isAllDetails,otpVerificationMiddleware.senior.isCorrectDetails,otpVerificationMiddleware.senior.isNotExists,otpVerificationMiddleware.senior.isCorrectOtp,otpVerificationMiddleware.senior.isOtpNotExpired,otpVerification.senior);

//registration for volunteer
app.post("/register/volunteer", registerMiddleware.volunteer.isAllDetails,registerMiddleware.volunteer.isCorrectDetails,registerMiddleware.volunteer.isExists,registerMiddleware.volunteer.isAccepted,register.volunteer);

//otp verification after volunteer registration
app.post("/otp-verify/volunteer", otpVerificationMiddleware.volunteer.isAllDetails,otpVerificationMiddleware.volunteer.isCorrectDetails,otpVerificationMiddleware.volunteer.isNotExists,otpVerificationMiddleware.volunteer.isCorrectOtp,otpVerificationMiddleware.volunteer.isOtpNotExpired,otpVerification.volunteer);

//login for volunteer
app.post("/login/volunteer", loginMiddleware.volunteer.isAllDetails,loginMiddleware.volunteer.isCorrectDetails,loginMiddleware.volunteer.isNotExists,login.volunteer);

//otp verification after volunteer login
app.post("/login/otp-verify/volunteer",loginVerifyMiddleware.volunteer.isAllDetails,loginVerifyMiddleware.volunteer.isCorrectDetails,loginVerifyMiddleware.volunteer.isNotExists,loginVerifyMiddleware.volunteer.isCorrectOtp,loginVerify.volunteer);

//login for senior
app.post("/login/senior", loginMiddleware.senior.isAllDetails,loginMiddleware.senior.isCorrectDetails,loginMiddleware.senior.isNotExists,login.senior);

//otp verification after senior login
app.post("/login/otp-verify/senior",loginVerifyMiddleware.senior.isAllDetails,loginVerifyMiddleware.senior.isCorrectDetails,loginVerifyMiddleware.senior.isNotExists,loginVerifyMiddleware.senior.isCorrectOtp,loginVerify.senior);

// app.post("/application",applicationFormMiddleware.isAllDetails,applicationFormMiddleware.isCorrectDetails,applicationFormMiddleware.isNotExists,applicationForm)

app.post("/admin",admin.signIn)
app.get("/:adminkey/volunteers",admin.getVolunteers)
app.post("/:adminkey/volunteer/assignTask",admin.assignTask)
app.get("/:adminkey/applications",admin.getApplications)
app.post("/:adminkey/application",adminMiddleware.isAllDetails,adminMiddleware.isCorrectDetails,adminMiddleware.isemailNumber,admin.getApplication)
app.put("/:adminkey/approve-application",adminMiddleware.isAllDetails,adminMiddleware.isCorrectDetails,adminMiddleware.isemailNumber,admin.approveApplication)
app.put("/:adminkey/reject-application",adminMiddleware.isAllDetails,adminMiddleware.isCorrectDetails,adminMiddleware.isemailNumber,admin.rejectApplication)

app.post("/senior/matches",matchingAlgorithmMiddleware.senior.isAllDetails,matchingAlgorithmMiddleware.senior.isCorrectDetails,matchingAlgorithmMiddleware.senior.isNotExists,matchAlgorithm.senior)
app.post("/volunteer/matches",matchingAlgorithmMiddleware.volunteer.isAllDetails,matchingAlgorithmMiddleware.volunteer.isCorrectDetails,matchingAlgorithmMiddleware.volunteer.isNotExists,matchAlgorithm.volunteer)


app.post("/volunteer/volunteer/application",upload.single("file"),formSubmissionMiddleware.volunteer.isAllDetails,formSubmissionMiddleware.volunteer.isCorrectDetails,formSubmissionMiddleware.volunteer.isExists,formSubmissionMiddleware.volunteer.isSubmitted,formSubmission.volunteer.submit)
app.get("/volunteer/application/:filename",formSubmission.volunteer.get)
app.get("/volunteer/:email",volunteer.get)
app.post("/volunteer/:email",upload.single("file"),volunteer.save)
app.post("/volunteer/volunteer/connect",volunteer.request)


app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
