 var mongoose = require("mongoose");

var overSchema =new mongoose.Schema({
    overNum: Number,
    bowler: String,
    balls: [],
    overTotal: Number,
    CumTotal: Number
});

module.exports = mongoose.model("over",overSchema);