const express = require('express');
const router = express.Router({mergeParams:true});
const User =require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport =require("passport");
const { saveRedirectUrl ,verifyOtp} = require('../middleware.js');

const userControllers= require("../controllers/user.js");

router.route("/signup")
.get(userControllers.renderSignUpForm)
.post(verifyOtp,wrapAsync(userControllers.signup));

// router.get("/signup",userControllers.renderSignUpForm);

// router.post("/signup",wrapAsync(userControllers.signup))

router.route("/login")
.get(userControllers.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userControllers.login));

// router.get("/login",userControllers.renderLoginForm)
router.get("/logout",userControllers.logout)

router.post("/sendotp",userControllers.sendOtp);

// router.post("/login",saveRedirectUrl,
// passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
// wrapAsync(userControllers.login)

// )





module.exports =router;