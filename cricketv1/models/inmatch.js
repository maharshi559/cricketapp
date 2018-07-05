 var mongoose = require("mongoose");

var inMatchSchema =new mongoose.Schema({
    teamA: String,
    teamB: String,
    numOfOvers: Number,
    numOfPlayers: Number,
    typeOfMatch: String,
    toss: String,
    chose: String
});

//var matchData = mongoose.model("match", matchSchema);

module.exports = mongoose.model("inmatch",inMatchSchema);