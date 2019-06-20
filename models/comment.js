var mongoose =require("mongoose");
//Create comment schema
var commentSchema=new mongoose.Schema({
   text: String,
   author: {
     id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
     },
     username: String
   }
});
//export model to use in other file
module.exports=mongoose.model("Comment", commentSchema);
