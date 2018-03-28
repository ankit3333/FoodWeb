var mongoose=require("mongoose");
var Dish=require("./models/dish"); 
var Comment=require("./models/comment");
var data=[
    
    ];

function seedDB(){
    //Remove all Dishes
    Dish.remove({},function(err){
      if(err){
            console.log(err);
        }else{
            console.log("Removed Dishes");
        }    
});
    //Add few camprgrounds
    data.forEach(function(seed){
    Dish.create(seed, function(err,data){
     if(err){
         console.log(err);
     }else{
         console.log("New Dish added");
         //create a comment
         Comment.create(
             {
                 text: "This place is very cold",
                 author:"me"
                 
             },function(err, comment){
                 if(err){
                     console.log(err);
                 }else{
                     data.comments.push(comment._id);
                     data.save();
                     console.log("Created new comment");
                 }
             });
              } 
        
    });
    
    });
}


module.exports = seedDB; 