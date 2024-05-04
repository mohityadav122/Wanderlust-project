if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
                                
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 

const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modeles/user.js");


const listingRout = require("./routes/listing.js");
const reviewRout = require("./routes/review.js");
const userRout = require("./routes/user.js");
const saveRedirectUrl = require("./middelware.js");

//const MONGO_URL = 'mongodb://127.0.0.1:27017/Wanderlust';

const dbUrl = process.env.ATLASDB_URL;


main()
.then(()=>{
    console.log("conctec to DB");
}).catch((err)=>console.log(err));

async function main(){
   await mongoose.connect(dbUrl );
};




app.set("view engine","ejs");
 app.set("views",path.join(__dirname, "views"));
 //id waale  url se new page keliye 
 app.use(express.urlencoded({extended: true})); 
 app.use(methodOverride("_method"));
 app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
    
});
store.on("error",()=>{
    console.log("ERROE in MONGO SESSION STORE", err)
    });

const sessionOption = {
store,

    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+7*24*60*60*1000,
        maxAge:  7*24*60*60*1000,
     httpOnly: true,
    },
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    
    next();
});




app.use("/listings",listingRout);
app.use("/listings/:id/reviews",reviewRout);
app.use("/",userRout);


app.all("*",(req,res,next)=>{
    next (new ExpressError (404,"page not found"));
});
// validation error
app.use((err,req,res,next)=>{
    
    let {statusCode= 500, message= "somthing went rong"}= err;
   // res.status(statusCode).send(massage);
   res.status(statusCode).render("listingsError.ejs",{err});
});

app.listen(4200,()=>{
console.log("listening start for server");
});
