var express = require("express");
var router  = express.Router();
var Dish = require("../models/dish");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX - show all dishes
router.get("/", function(req, res){
    var numofdishes =8;
    var integer = parseInt(req.query.page);
    var pno = integer ? integer : 1;
    var notFound = null;
      if(req.query.search_res){
       const regex = new RegExp(escapeRegex(req.query.search_res), 'gi');
          Dish.find({restaurant: regex}).skip((numofdishes * pno) - numofdishes).limit(numofdishes).exec(function (err, allDishes) {
              if(err){
                  console.log(err);
              }
            Dish.count({name: regex}).exec(function (err, count){            
       if(err){
           console.log(err);
       } else {
           if(allDishes.length < 1) {
                  notFound = "No search matches found, please search again."; 
              }
          res.render("dishes/index",{
              dishes:allDishes , 
              current:pno,
              pages: Math.ceil(count / numofdishes),
              notFound: notFound,
              search:req.query.search_res
              
          });
       }
    });
          });
    }
    else if(req.query.search){
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
          Dish.find({name: regex}).skip((numofdishes * pno) - numofdishes).limit(numofdishes).exec(function (err, allDishes) {
              if(err){
                  console.log(err);
              }
            Dish.count({name: regex}).exec(function (err, count){            
       if(err){
           console.log(err);
       } else {
           if(allDishes.length < 1) {
                  notFound = "No search matches found, please search again.";
              }
          res.render("dishes/index",{
              dishes:allDishes , 
              current:pno,
              pages: Math.ceil(count / numofdishes),
              notFound: notFound,
              search:req.query.search
              
          });
       }
    });
          });
    }else{
    // Get all dishes from DB
      Dish.find().skip((numofdishes * pno) - numofdishes).limit(numofdishes).exec(function (err, allDishes) {
          if(err){
              print(err);
          }
            Dish.count().exec(function (err, count){ 
       if(err){
           print(err);
       } else {
          res.render("dishes/index",{dishes:allDishes , current:pno,
              pages: Math.ceil(count / numofdishes),
              notFound: notFound,
              search:false
       });
            }
    });
    });
}
});




//CREATE - add new dish to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to dishes array
  var name = req.body.name;
  var image = req.body.image;
  var price= req.body.price;
  var desc = req.body.description;
  var rest=req.body.restaurant;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
   console.log("process.env.GEOCODER_API_KEY is " + process.env.GEOCODER_API_KEY);
   geocoder.geocode(req.body.location, function (err, data) {
     if (err || !data.length) {
       req.flash('error', 'Invalid address');
       return res.redirect('back');
     }
     var lat = data[0].latitude;
     var lng = data[0].longitude;
     var location = data[0].formattedAddress;
    var newDish = {name: name, price:price,image: image, description: desc,restaurant: rest, author:author,location: location, lat: lat, lng: lng};
    // Create a new dish and save to DB
    Dish.create(newDish, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to dishes page
            console.log(newlyCreated);
            res.redirect("/dishes");
        }
    });
});
});
//NEW - show form to create new dish
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("dishes/new"); 
});

// SHOW - shows more info about one dish
router.get("/:id", function(req, res){
    //find the dish with provided ID
    Dish.findById(req.params.id).populate("comments").populate("likes").exec( function(err, foundDish){
        if(err){
            console.log(err);
        } else {
            //render show template with that dish
            
            res.render("dishes/show", {dish: foundDish});
        }
    });
    
});
//EDIT DISH ROUTE

router.get("/:id/edit",middleware.checkDishOwnership,function (req,res){
    
         Dish.findById(req.params.id, function(err,foundDish){
            
       
                res.render("dishes/edit", {dish :foundDish});
         
        });
});

// UPDATE DISH ROUTE
router.put("/:id", middleware.checkDishOwnership, function(req, res){
   geocoder.geocode(req.body.location, function (err, data) {
     if (err || !data.length) {
       req.flash('error', 'Invalid address');
       return res.redirect('back');
     }
     var lat = data[0].latitude;
     var lng = data[0].longitude;
     var location = data[0].formattedAddress;
     var newData = {name: req.body.name, image: req.body.image, price:req.body.price, description: req.body.description, restaurant:req.body.restaurant,location: location, lat: lat, lng: lng};
    Dish.findByIdAndUpdate(req.params.id, newData, function(err, dish){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/dishes/" + dish._id);
        }
    });
  });
});

//DESTROY DISH ROUTE

router.delete("/:id",middleware.checkDishOwnership,function(req,res){
   Dish.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/dishes");
       }else{
           res.redirect("/dishes");
       }
   });
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = router;