var mongoose = require("mongoose");


var itemSchema = new mongoose.Schema({
        name: String,
        price: String,
        image: String,
        description: String,
        time: Number,
        comments: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment"
                }
        ]
    });


module.exports = mongoose.model("Item", itemSchema);