var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware/index");//the name taken index so it will automatically look for index file

//INDEX -Display all campgrounds
router.get("/", function(req,res){
    //To fetch image from db and then render
    Campground.find({}, function(err,allCampgrounds){
      if(err){
        req.flash("error", "Can't find Campgrounds!")
        console.log(err);
      }else {
        res.render("campground/index", {campgrounds:allCampgrounds});
      }
    });
});

//CREATE - Add new campground to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    var name=req.body.campname;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
      id: req.user._id,
      username: req.user.username
    }
    var newCampground={name: name, image: image, description:desc, author: author};
    //create new campground and save it to DB
    Campground.create(newCampground, function(err,newlyCrerated){
      if(err){
        req.flash("error", "Something went wrong!");
        console.log(err);
      }else {
        //Redirect To campground
        res.redirect("/campgrounds");
      }
  });
});

//NEW -Display form for new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campground/new");
});

//SHOW -Show info about one campground
router.get("/:id", function(req,res){
  //find campground with provided id
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){  //here we are populating comments for perticular campground
    if(err){
      req.flash("error", "Something went wrong!");
      console.log(err);
    }else {
      //render show template for that id
      res.render("campground/show", {campground: foundCampground});
    }
  });
});

//EDIT campground
router.get("/:id/edit", middleware.checkPostOwnerShip, function(req, res){
  //find perticlular campground and redirect to edit page
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      req.flash("error", "Something went wrong!");
      console.log(err);
      res.redirect("/campgrounds/" + foundCampground._id);
    }else {
      res.render("campground/edit", {campground: foundCampground});
    }
  });
});

//UPDATE campground
router.put("/:id", middleware.checkPostOwnerShip, function(req, res){
  //find campground by id and update it and redirect to show page[here we use req.body.campground where we rap all info of campground into campground variable]
  Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedcampground){
    if(err){
      req.flash("error", "Something went wrong!");
      console.log(err);
      res.redirect("/campgrounds");
    }else{
      console.log(req.body.camp);
      req.flash("success", "Campground Updated!!!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY campground
router.delete("/:id", middleware.checkPostOwnerShip, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong!");
      res.redirect("/campgrounds");
    }else{
      req.flash("success", "Campground is Removed!!!");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
