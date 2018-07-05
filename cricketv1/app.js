var express = require("express"),
    bodyParser = require("body-parser"),
    request = require("request"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose");
    
var matchData = require("./models/matches"),
    teamsData   =   require("./models/teams"),
    inmatchData =   require("./models/inmatch"),
    overData =   require("./models/over");

var app = express();
var newMatch = {};
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//mongoose setup
mongoose.connect("mongodb://localhost/cricketapp",  {useMongoClient: true});


// Routing

function fetchJSON(url) {
    return new Promise(function(resolve, reject){
            request(url, function(err, res, body) {
                if (err) {
                    reject(err);
                } else if (res.statusCode !== 200) {
                    reject(new Error('Failed with status code ' + res.statusCode));
                } else {
                    resolve(JSON.parse(body));
                }
            });
});
}

app.get('/', function (req, res, next) {

    const newsData = fetchJSON('https://newsapi.org/v1/articles?source=espn-cric-info&sortBy=latest&apiKey=b705dbb157424037bb8324489edd1345');
    const matchData = fetchJSON('http://cricapi.com/api/matchCalendar?apikey=W6hmrKfblWMlotm9CRB9wLrbyf62');

    Promise.all([newsData, matchData]).then(function(data){
        res.render("home", {
        news_data: data[0],
        match_data: data[1]
    });
}).catch(function(err){
        console.error('There was a problem', err)
    });
});

app.get("/previousMatch", function(req, res) {
   matchData.find({},function(err, previousMatches) {
       if(err){
           console.log("previous match data not found");
       }
       else{
           res.render("previousMatch", {history : previousMatches});
       }
   }) 
});

app.get("/teams",function(req, res) {
    teamsData.find({}, function(err, allteams) {
        if(err){
            console.log("teams data not found");
        }
        else{
            res.render("teams.ejs", {teams:allteams});
        }
    })
});

app.get("/teams/new", function(req, res){
    res.render("newteam");
});

app.post("/teams", function(req, res) {
    var player=[];
    //console.log(req.body);
    
    //console.log(player);
    teamsData.create(req.body, function(err, newlyCreatedteam) {
        if(err){
            console.log("creating team failed");
        }
        else{
          //  console.log(newlyCreatedteam);
            res.redirect("teams");
        }
    });
});

app.get("/teams/:id", function(req,res){
   // console.log(req.params.id);
   
            teamsData.findById(req.params.id,function(err, match){
               if(err){
                   console.log("=============================================================================");
                   console.log("match not found"+err);
               } else{
                    res.render("scorecard",{currentTeam :match});
                //    console.log("******Get req Data*******")
                   // console.log(match); 
               }
            });
          
});

app.get("/newmatch", function(req, res){
   //res.render("newmatch"); 
    teamsData.find({}, function(err, teamFound){
       if(err){
           console.log("error getting data");
       }
       else{
           
           res.render("newmatch", {teams: teamFound});
       }
   });
 
});


app.post("/scorecard", function(req,res){
    
    var newMatch = req.body;
    //console.log(newMatch);
    matchData.create(newMatch, function(err, newlyCreated){
        if(err){
            console.log("Data not Created");
        }
        else{
            //res.render("scores/"+newlyCreated._id, {scores: newlyCreated});
            //console.log(newlyCreated._id);
            res.redirect("scores/"+newlyCreated._id);
        }
    });
    
});

// app.put("/scores/:id", function(req,res){
//     //console.log(req.params.id);
//     //console.log(req.body.match);
//     console.log("=============================================================================");
//     matchData.findByIdAndUpdate(req.params.id,req.body.match,function(err, matchFound){
//         if(err){
//             console.log("problem in finding matches");
//         }
//         else{
//             matchData.findById(req.params.id,function(err, match){
//               if(err){
//                   console.log(match);
//               } else{
//                     res.render("scores",{currentMatch :match});
//                   //  console.log(match); 
//               }
//             });
//         }
//     });
    
// });

app.post("/scores/:id", function(req,res){
    //console.log(req.params.id);
    //console.log(req.body.match);
    console.log("=============================================================================");
      teamsData.find({teamName:req.body.teamA},function(err, players){
              if(err){
                  console.log("teams data not found");
              } else{
                    res.render("scores",{players :players});
                    console.log("******Post req Data*******")
                    console.log(players); 
              }
            });       
});

app.get("/scores/:id", function(req,res){
   // console.log(req.params.id);
   
   matchData.findById(req.params.id, function(err, allteams) {
       if(err){
           console.log("match not found");
       }
       else{
           console.log(allteams);
           if(allteams.choseTo == "Bat"){
               teamsData.find({teamName: allteams.tossWon}, function(err, battingFirst) {
                   if(err){
                       console.log("match found but teams not found");
                   }
                   else{
                       //console.log("team: "+battingFirst);
                       res.render("scores", {battingFirst: battingFirst, team: allteams});
                   }
               })
           }
       }
   })

});

app.post("/scores/:id/scorecard",function(req, res) {
    //console.log(req.params.id);
    matchData.findById(req.params.id, function(err,allteams){
        if(err){
            console.log("match not found");
            res.redirect("newmatch");
        }
        else{
            console.log(allteams);
           if(allteams.teamA == allteams.tossWon && allteams.choseTo == "Bat"){
               teamsData.find({teamName: allteams.teamB}, function(err, battingFirst) {
                   if(err){
                       console.log("match found but teams not found");
                   }
                   else{
                       //console.log("team: "+battingFirst);
                       res.render("bowler", {battingFirst: battingFirst, team: allteams});
                   }
               });
           }
           else if(allteams.teamB == allteams.tossWon && allteams.choseTo == "Bat"){
               teamsData.find({teamName: allteams.teamA}, function(err, battingFirst) {
                   if(err){
                       console.log("match found but teams not found");
                   }
                   else{
                       //console.log("team: "+battingFirst);
                       res.render("bowler", {battingFirst: battingFirst, team: allteams});
                   }
               });
           }
           
        }
    });
})
var overTotal;


app.post("/scores/:id/scorecard/newover", function(req,res){
    console.log("You are in post route of new over");
    //console.log(req.body);
    //console.log("ID: "+req.params.id);
    
  matchData.findById(req.params.id, function(err, matchFound) {
      if(err){
          console.log(err);
      } else{
          teamsData.find({teamName: matchFound.teamA}, function(err, battingFirst) {
                   if(err){
                       console.log("match found but teams not found");
                   }
                   else{
                       //console.log("team: "+battingFirst);
                       overData.create(req.body,function(err, newover) {
                            if(err){
                                console.log(err);
                            }  else{
                                //console.log("created new over: "+newover);
                                //res.render("singleball", {team: matchFound});
                                matchFound.overs.push(newover);
                                matchFound.save();
                                overTotal=0;
                                console.log("created new over: "+matchFound);
                                res.render("singleball", {battingFirst: battingFirst, team: matchFound, over:newover, overTotal: overTotal});
                            }
                        });
                       //
                   }
               });
            
      }
  });   
});

app.post("/scores/:id/scorecard/newover/:overId", function(req,res){
    console.log("You are in post route of new ball");
    console.log(req.body);
 
    
      matchData.findById(req.params.id, function(err, matchFound) {
      if(err){
          console.log(err);
      } else{
          teamsData.find({teamName: matchFound.teamA}, function(err, battingFirst) {
                   if(err){
                       console.log("match found but teams not found");
                   }
                   else{
                      // console.log("team: "+battingFirst);
                       overData.findById(req.params.overId,function(err, newover) {
                            if(err){
                                console.log(err);
                            }  else{
                                console.log("found over: "+newover);
                                console.log(req.body.score);
                                
                                if(!isNaN(Number(req.body.score))){
                                overTotal = Number(overTotal) + Number(req.body.score);
                                }
                                else if(req.body.score == "Wd+1" || req.body.score == "Nb+1"  ){
                                 overTotal = Number(overTotal) + 2;
                                    
                                }
                                else if(req.body.score == "Wd+2" || req.body.score == "Nb+2" ){
                                    overTotal = Number(overTotal) + 3;
                                }
                                else if(req.body.score == "Wd+3" || req.body.score == "Nb+3" ){
                                    overTotal = Number(overTotal) + 4;
                                }
                                else if(req.body.score == "Wd+4" || req.body.score == "Nb+4" ){
                                    overTotal = Number(overTotal) + 5;
                                }
                                else if(req.body.score == "Wd" || req.body.score == "Nb" ){
                                    overTotal = Number(overTotal) + 1;
                                }
                                
                                
                                  
                                  console.log("over total: "+overTotal);
                                    newover.balls.push(req.body.score);
                                    newover.save();
                                //res.render("singleball", {team: matchFound});
                                console.log("found over: "+newover);
                                
                                
                                res.render("singleball", {battingFirst: battingFirst, team: matchFound, over:newover, overTotal:overTotal});
                            }
                        });
                       //
                   }
               });
            
      }
  });                  
    
    
});





app.listen(process.env.PORT, process.env.IP,function(){
    console.log("server started");
});