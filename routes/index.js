var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

//HOME - home page of yelp camp
router.get("/", function(req,res){
    res.render("landing");
});

//Registration form
router.get("/register", function(req, res){
  res.render("register");
});
//handle sign up logic
router.post("/register", function (req, res){
  var newuser=new User({username: req.body.username});//save username to DB
  User.register(newuser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      req.flash("error", err.message);
      res.redirect("/register");
    }else {
      passport.authenticate("local")(req, res, function(){
        req.flash("success", "Welcome to YelpCamp " + user.username);
        res.redirect("/campgrounds");
      });
    }
  });
});

//show up login form
router.get("/login", function(req, res){
  res.render("login");
});
//login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureredirect: "/login"
}),function(req, res){
});

//logout logic
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/");
});

module.exports = router;
