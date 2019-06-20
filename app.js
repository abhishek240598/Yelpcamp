var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    localStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDb         = require("./seeds");

//requiring routes
var commentRoutes    = require("./routes/comment"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_v10", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);//to remove warning of (DeprecationWarning: collection.findAndModify is deprecated)
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); //if you use only /public it'll worl but to be just sure we use __dirname
app.use(flash());
//seedDb();  //seeding the databae

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Rusty is colt's favourite dog!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//tell every route/template to use this currentuser info
app.use(function(req, res, next){
  res.locals.currentUser = req.user; //Holds the information about currently logged in user
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();//
});

app.use("/campgrounds", campgroundRoutes);  //it will append /campgrounds to every routes of campground.js
app.use("/campgrounds/:id/comments", commentRoutes); //append /campgrounds/:id/comments to every routes of comment.js
app.use("/", indexRoutes);//here nothing to append to index route

//To Make Express Listen User Request
app.listen(3000, function(err){
    if(err){
      console.log(err);
    }
    console.log("The YelpCamp Server Started!!!");
});
