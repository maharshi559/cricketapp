var mongoose  = require("mongoose");

mongoose.connect("mongodb://localhost/cricketapp",  {useMongoClient: true});

var matchSchema =new mongoose.Schema({
    teamA: String,
    teamB: String,
    overCount: Number,
    playerCount: Number,
    type: String
});

var matchData = mongoose.model("match", matchSchema);

