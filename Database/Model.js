import { application } from "express";
import mongoose from "./Config.js";

const seniorSchema = mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    dob:Date,
    address:String,
    emergencycontact:Object,
    city:String,
    state:String,
    zipcode:String,
    interests:Array,
    loginotp:String,
    loginverified:String,
    services:Array,
    specialneeds:String,
    otp:String,
    expiresAt:Date,
    userverified:Boolean,
    application:Object,
    applicationStatus:{type:String,default:"Not Submitted"}
},{minimize:false})

const volunteerSchema = mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    address:String,
    city:String,
    state:String,
    zipcode:String,
    skills:Array,
    availability:Array,
    experience:String,
    loginotp:String,
    loginverified:String,
    emergencycontact:Object,
    otp:String,
    expiresAt:Date,
    userverified:Boolean,
    application:Object,
    applicationStatus:{type:String,default:"Not Submitted"}
},{minimize:false})


const seniorModel = new mongoose.model("senior",seniorSchema)
const volunteerModel = new mongoose.model("volunteer",volunteerSchema)

export  {seniorModel,volunteerModel};