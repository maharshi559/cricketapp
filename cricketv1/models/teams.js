 var mongoose = require("mongoose");

var teamsSchema =new mongoose.Schema({
    teamName: String,
    player: []
});

//var matchData = mongoose.model("match", matchSchema);

module.exports = mongoose.model("team",teamsSchema);