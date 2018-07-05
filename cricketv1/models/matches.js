 var mongoose = require("mongoose");

var matchSchema =new mongoose.Schema({
    teamA: String,
    teamB: String,
    numOfOvers: Number,
    numOfPlayers: Number,
    typeOfMatch: String,
    tossWon: String,
    choseTo: String,
    overs: [{type:mongoose.Schema.Types.ObjectId,ref:"over"}]
});


module.exports = mongoose.model("match",matchSchema);