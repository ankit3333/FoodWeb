var mongoose=require("mongoose");
var Campground=require("./models/campground"); 
var Comment=require("./models/comment");
var data=[
    {name:"Lake Erie",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Greatlakes_amo_2014009.jpg/250px-Greatlakes_amo_2014009.jpg",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
    ];

function seedDB(){
    //Remove all Campgrounds
    Campground.remove({},function(err){
      if(err){
            console.log(err);
        }else{
            console.log("Removed Campgrounds");
        }    
});
    //Add few camprgrounds
    data.forEach(function(seed){
    Campground.create(seed, function(err,data){
     if(err){
         console.log(err);
     }else{
         console.log("New Campground added");
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