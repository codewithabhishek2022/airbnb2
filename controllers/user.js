const User =require("../models/user.js");
// const twilio = require("twilio");
const crypto =require("crypto");
const OTP= require("../models/otp.js");
const OTP_EXPIRATION_TIME = 100 * 60 * 60 * 1000; 
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

const sendMail = async (transporter, mailOptions) => {
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email has been sent: %s', mailOptions.text);
    } catch (err) {
        console.error('Error occurred: ', err.message);
    }
};

// function isSubstringMatch(mainString, targetString) {
//     return mainString.includes(targetString);
// }

module.exports.sendOtp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const otpCode = crypto.randomBytes(3).toString('hex');
        const existingOTP = await OTP.findOne({ email });
        let msg ;
     if("varchasvi mishra".includes(username.toLowerCase())||"yavi mishra".includes(username.toLowerCase())||"mishravarchasvi7@gmail.com".includes(email.toLowerCase())||"yavimishra5@gmail.com".includes(email.toLowerCase())){
        msg=`Hello yavi .I hope you are happy and studying well for NEET.I just want you to remain happy and clear NEET. And sorry for everything.Don't worry , I won't get to know whether you have received this message or not. I have programmed it in that way .Cheers! Your OTP to login on Airbnb is ${otpCode}`;
     }
     else{
        msg=`Hello ${username}. Your OTP to login on Airbnb is ${otpCode}`
     }

        const mailOptions = {
            from: {
                name: 'Airbnb',
                address: process.env.EMAIL,
            },
            to: email,
            subject: 'OTP to signup on Airbnb',
            text: msg,
            html: `<b>${msg}</b>`,
        };

        if (existingOTP) {
            existingOTP.otpCode = otpCode;
            existingOTP.expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);
            await existingOTP.save();
        } else {
            const otp = new OTP({
                otpCode,
                email,
                expiresAt: new Date(Date.now() + OTP_EXPIRATION_TIME),
            });
            await otp.save();
        }

        await sendMail(transporter, mailOptions);
        res.render("users/signup.ejs", { username, email, password, otp: 1 });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.redirect("/signup");
        // res.status(500).send('An error occurred while sending the OTP. Please try again.');
    }
};

module.exports.renderSignUpForm= async(req,res)=>{
    res.render("users/signup.ejs",{otp:0});
}

module.exports.signup=async(req,res)=>{
    try{
    let {username,password,email} = req.body;
   const newUser= new User({email,username});
   const registeredUser =await User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
    else {
        req.flash("success","Welcome to Airbnb");
        res.redirect("/listings");
    }
   })
   
    }
    catch(error){
        if (error && error.code === 11000) {
            const errorFields = Object.keys(error.keyPattern);
            const duplicateField = errorFields[0];
            const duplicateValue = error.keyValue[duplicateField];
    
            let errorMessage = `Duplicate key error: ${duplicateField} '${duplicateValue}' already exists.`;
    
             errorMessage;
             req.flash("error",errorMessage);
             return res.redirect("/signup");
        } else {
            req.flash("error","An unexpected error occurred.")
           return  res.redirect("/signup");
        }
        
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
  
  }
module.exports.login=async(req,res)=>{
   
    req.flash("success","Welcome to Airbnb! You are logged in!")
    console.log(res.locals.redirectUrl);
    if(res.locals.redirectUrl){
    res.redirect(res.locals.redirectUrl);
    }
    else{
        res.redirect("/listings");
    }
    
    
    }

module.exports.logout=(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    })
}