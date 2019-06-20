var express    = require("express"),
    router     = express.Router({mergeParams: true}), //here it is not finding id so to merge parameters of  comments and campgrounds
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware/index");

//NEW- create new form for comments
router.get("/new",middleware.isLoggedIn, function(req, res){
  //find Campground By Id
    Campground.findById(req.params.id, function(err, campground){
      if(err){
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("back");
      }else {
        res.render("comment/new", {campground: campground});
      }
    });
});

//CREATE-create comments and save it to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  //Find Campground By Id
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong!");
      res.redirect("/campgrounds");
    }else{
        //Add comments to DB
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
          }else{
             //add userid and username to comments
             comment.author.id = req.user._id;
             comment.author.username = req.user.username;
             //save comment
             comment.save();
             //push new created comment to campgrounds schema comments
             foundCampground.comments.push(comment);
             //save it to DB
             foundCampground.save();
             res.redirect('/campgrounds/'+ foundCampground._id);          //redirect back it to campground show page!
          }
        });
    }
  });
});

//EDIT- edit comments render comment forms
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong!");
      res.redirect("back");
    }else{
      res.render("comment/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

//UPDATE- update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong!");
      ers.redirect("back");
    }else {
      req.flash("success", "Comment is updated!!!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong!");
      res.redirect("back");
    }else{
      req.flash("success", "Comment is Removed!!!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
