var Campground   = require("../models/campground"),
    Comment      = require("../models/comment");
//middleware functions are here
var middlewareObj={}                                                                    //we can do this 3 ways   1>var middleware={//make methods here}e.x{checkPostOwnerShip=function()}
                                                                                        //2> module.exports={//put functions here}
//new middleware for checking ownership of post
middlewareObj.checkPostOwnerShip = function(req, res, next){
  //is user isLoggedIn?
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "Campground not found!");
        res.redirect("back");
      }else{
        //is user own that post?
        if(foundCampground.author.id.equals(req.user._id)){//check userid with post author id
          next();//move to next function
        }else{
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  }else{
    req.flash("error", "You need to logged in to do that!");
    res.redirect("/login");
  }
}

//new middleware for checking ownership of post
middlewareObj.checkCommentOwnership = function(req, res, next){
  //is user isLoggedIn?
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        console.log(err);
        req.flash("error", "Comment not found!");
        res.redirect("back");
      }else{
        //is user own that post?
        if(foundComment.author.id.equals(req.user._id)){//check userid with post author id
          next();//move to next function
        }else{
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  }else{
    req.flash("error", "You need to logged in to do that!");
    res.redirect("/login");
  }
}

//simple check the user is loggedin or not
middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash("error", "You need to Logged in to do that!");
    res.redirect("/login");
  }
}


module.exports=middlewareObj;
