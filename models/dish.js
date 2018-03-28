var mongoose=require("mongoose");


// SCHEMA SETUP
var dishSchema = new mongoose.Schema({
   name: String,
   price: Number,
   image: String,
   description: String,
   location:String,
   lat:Number,
   lng:Number,
   createdAt: { type: Date, default: Date.now },
   author: {
       id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
       },
       username: String
   },
   comments:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }   
    ]
});

 module.exports= mongoose.model("Dish", dishSchema);