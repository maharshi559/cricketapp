 var mongoose = require("mongoose");

var overSchema =new mongoose.Schema({
    overNum: Number,
    Bowler: String,
    balls: []
});

//var matchData = mongoose.model("match", matchSchema);

module.exports = mongoose.model("over",overSchema);