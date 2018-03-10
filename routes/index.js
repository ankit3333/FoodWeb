var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User    =  require("../models/user");

//AUTH ROUTES

//SHOW REGISTER FORM

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/register",function(req,res){
   res.render("register"); 
});

// Handle Sign Up Logic

router.post("/register", function(req, res) {
    var newUser= new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            req.flash("error", err.message);
            res.redirect("register");
        }
            passport.authenticate("local")(req,res, function(){

                res.redirect("/campgrounds");
            });
    });
});

//show Login Form

router.get("/login", function(req, res) {
   res.render("login"); 
});

//Handling Logic
router.post("/login", passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login",
    successFlash: "Welcome",
    failureFlash: "Invalid Username or Password"
}),function(req,res){
    
});

//LOGOUT ROUTE

router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;