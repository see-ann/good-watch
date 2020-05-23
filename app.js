var express = require('express');
es6Renderer = require('express-es6-template-engine');
var app = express();
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');  
var path = require('path');
var unirest = require("unirest");


var multer  = require('multer');
var upload = multer();

// Create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.get('/', function (req, res) {
   //res.sendFile( __dirname + "/views/" + "index.html" );
   res.render('index', {locals: {title: 'Welcome!'}});
})

app.post('/info', upload.none(), async function (req, res, next) {
    info1 = await processResponse(req.body.title);
    if (info1[0]=="False"){
        res.send('<b><a href="./">Movie is not found. Find another movie.</a></b>');
    }
    else{
        info2 = await processResponse2(info1[1]);
        res.render('info',{locals:{allInfo:info2}});
    }
    //res.render('index', {locals: {allInfo: info}});
    //res.send(info[0].Poster);
  })

  app.post('/library', upload.none(), async function (req, res, next) {
    res.send(req.body);
  })

//Find IMDB ID
function processResponse(response){
    return new Promise(function(resolve, reject) {
        var req = unirest("GET", "https://movie-database-imdb-alternative.p.rapidapi.com/");
        req.query({
            "page": "1",
            "r": "json",
            "s": response
        });

        req.headers({
            "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
            "x-rapidapi-key": "f216588249msh213fcde5db9d142p19cc64jsn8b430b104cef",
            "useQueryString": true
        });


        req.end(function (res) {
            if (res.error) throw new Error(res.error);
            if (res.body.Response=="False"){
                info = ["False"];
            }
            else {
                info = ["True", res.body.Search[0].imdbID];
            }
            //console.log(res.body.Search[0].Title);
            resolve(info);
        });
    });
}
//Grab movie information given IMDB id
function processResponse2(response){
    return new Promise(function(resolve,reject){
        var req = unirest("GET", "https://movie-database-imdb-alternative.p.rapidapi.com/");
        req.query({
            "i": response,
            "r": "json",
            "plot": "full"
        });

        req.headers({
            "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
            "x-rapidapi-key": "f216588249msh213fcde5db9d142p19cc64jsn8b430b104cef",
            "useQueryString": true
        });


        req.end(function (res) {
            if (res.error) throw new Error(res.error);
            info = res.body;
            console.log(info);
            resolve(info);
        });
    });

}
var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

