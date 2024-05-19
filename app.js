if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const ExpressError = require("./utils/Expresserror.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore =require("connect-mongo");

const flash =require("connect-flash");
const passport =require("passport");
const LocalStrategy =require("passport-local");
const User =require("./models/user.js");




const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter =require("./routes/user.js");

const MONGO_URL =
  process.env.ATLAS_DB_URL;
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
    console.log("error occured connecting database");
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(morgan("dev"));
app.use(cookieParser("this is my secret key"));
app.set('view cache', false);
const store =MongoStore.create({
  mongoUrl:MONGO_URL,
  collection:"sessions",
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:1*60*60
})

store.on("error",()=>{
  console.log("session store error",err);
})

const sessionOptions ={
  store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+24*60*60*1000,
        maxAge: 24*60*60*1000,
        httpOnly:true,
    }
}



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/", (req, res) => {
//     // res.cookie("name","Abhishek",{signed:true});
//   res.send("Hi , I am Abhishek");
// });


// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("Hello");
// })


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.currentUser=req.user;
    next();
})


app.get("/demouser",async(req,res,next)=>{
let fakeUser = new User({
    email:"student@gmail.com",
    username:"student",
     })
   let registeredUser=await  User.register(fakeUser,"helloworld");
   console.log(registeredUser);
   res.send(registeredUser);


}

)

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/",userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});
app.listen(8080, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:8080`);
});
