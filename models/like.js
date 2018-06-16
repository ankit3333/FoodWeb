var mongoose=require("mongoose");

var likeSchema= mongoose.Schema({
    like: Boolean,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
             ref: "User"
        }
    },
    dish: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
             ref: "Dish"
        }
    }
});


module.exports=mongoose.model("Like",likeSchema);