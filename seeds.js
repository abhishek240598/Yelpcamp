var mongoose  =require("mongoose"),
    Campground=require("./models/campground"),
    Comment   =require("./models/comment")
    data=[
      {
        name:"Moon spot",
        image:"https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      },
      {
        name:"Sun Rise",
        image:"https://images.unsplash.com/photo-1539712258047-fd138a7e6737?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      },
      {
        name:"Girnger's Rail",
        image:"https://images.unsplash.com/photo-1486179814561-91c2d61316b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      }
    ];

function seedDb(){
  //Remove all campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("All campgrounds are removed!");
      data.forEach(function(seed){
        Campground.create(seed, function(err, camp){
          if(err){
            console.log(err);
          }else {
            console.log("Added Campground!");
            Comment.create({
              text:"This place is very good! but i wish there is internet",
              author:"homer"
            },function(err, comment){
              if(err){
                console.log(err);
              }else {
                camp.comments.push(comment);
                camp.save();
                console.log("Added new campground comment!");
              }
            });
          }
        });
      });
    }
  });
}

module.exports= seedDb;
