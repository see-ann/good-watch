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


app.get('/', async function (req, res) {
    data = await select();
    var finalString = JSON.stringify(data).replace(/[\']/g, "&apos;");
    res.render('library', {locals: {allData: finalString}});
 })
 

app.get('/info', upload.none(), async function (req, res, next) {
    info1 = await processResponse(req.query.title);
    if (info1[0]=="False"){
        res.send('<b><a style = "font-family:Lato;" href="./">Movie is not found. Find another movie.</a></b>');
    }
    else{
        info2 = await processResponse2(info1[1]);
        res.render('info',{locals:{allInfo:info2}});
    }
    //res.render('index', {locals: {allInfo: info}});
    //res.send(info[0].Poster);
  })

  app.get('/process_get', upload.none(), async function (req, res, next) {
      response = [[info2.Poster, info2.Title, info2.Director, info2.imdbRating, req.query.watch, "Not set", getDate()]];  
      initialData = await select();
      match = await checkMatchingTitle(initialData, response[0][1]); 
      if (match == "false"){
        store = await storeIntoDatabase(response);
        data = await select();
        var finalString = JSON.stringify(data).replace(/[\']/g, "&apos;");
        res.render('library', {locals: {allData: finalString}});
      }
      else if (match == "true"){
        data = await select();
        var finalString = JSON.stringify(data).replace(/[\']/g, "&apos;");
        res.render('library', {locals: {allData: finalString}});
      }
  })

  app.get('/delete', upload.none(), async function (req, res, next) {
    console.log(req.query.id);
    wait = await deleteFromDatabase(req.query.id);
    data = await select();
    var finalString = JSON.stringify(data).replace(/[\']/g, "&apos;");
    res.render('library', {locals: {allData: finalString}});
})

app.get('/update', upload.none(), async function (req, res, next) {
    date = req.query.date;
    newDate = convertDate(date);
    wait = await update(newDate, req.query.id);
    data = await select();
    var finalString = JSON.stringify(data).replace(/[\']/g, "&apos;");
    res.render('library', {locals: {allData: finalString}});
})

app.get('/update2', upload.none(), async function (req, res, next) {
    wait = await update2(req.query.watch, req.query.id);
    data = await select();
    var finalString = JSON.stringify(data).replace(/[\']/g, "&apos;");
    res.render('library', {locals: {allData: finalString}});
})

function getDate(){
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var today = new Date();
    var dd    = String(today.getDate()).padStart(2, '0');
    var mm    = months[today.getMonth()];
    var yyyy  = today.getFullYear();
  
    today = mm + " " + dd + ", " + yyyy;
    return today;
  }

  function convertDate(date){
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    console.log(typeof(date));
    dateArray = date.split('-');
    var dd    = dateArray[2] ;
    var month    = months[dateArray[1]-1];
    var yyyy  = dateArray[0];
  
    newDate = month + " " + dd + ", " + yyyy;
    return newDate;
  }
  
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

function storeIntoDatabase(response){
    return new Promise(function(resolve, reject) {
        var mysql = require('mysql');

        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "seanwang1327!",
            database: "mydb"
        });

        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            //"if not exists (select Title from test3 d where d.Title =" + response[0][1] + ") INSERT INTO test3 (Image, Title, Director, Rating, Shelf, dateWatched, dateAdded) VALUES ?";
            var sql = "INSERT INTO test3 (Image, Title, Director, Rating, Shelf, dateWatched, dateAdded) VALUES ?";
            var values = response;
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
                resolve(values);
            });
        });

    }); 
    
}
function checkMatchingTitle(response, title){
    return new Promise(function(resolve,reject){
        var match = "false";
        titleData = response.title;
        for (var i = 0; i<titleData.length; i++){
            if (title==titleData[i]){
                match = "true";
            }
      }
      resolve(match);

    });
}
function deleteFromDatabase(response){
    return new Promise(function(resolve, reject) {
        var mysql = require('mysql');
        var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "seanwang1327!",
        database: "mydb"
        });
        con.connect(function(err) {
            if (err) throw err;
            var sql = "DELETE FROM test3 WHERE ID ="+ response;
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Number of records deleted: " + result.affectedRows);
              resolve("Done");
            });
          });
    });
}

function update(response1, response2){
    return new Promise(function(resolve, reject) {
        var mysql = require('mysql');
        var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "seanwang1327!",
        database: "mydb"
        });
        con.connect(function(err) {
            if (err) throw err;
            console.log("Response1", typeof(response1) );
            var sql = "UPDATE test3 SET dateWatched = '" + response1+  "' WHERE id = "+ response2;
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log(result.affectedRows + " record(s) updated");
              resolve('Done');
            });
        });
    });
}

function update2(response1, response2){
    return new Promise(function(resolve, reject) {
        var mysql = require('mysql');
        var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "seanwang1327!",
        database: "mydb"
        });
        con.connect(function(err) {
            if (err) throw err;
            console.log("Response1", response1);
            var sql = "UPDATE test3 SET Shelf = '" + response1+  "' WHERE id = "+ response2;
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log(result.affectedRows + " record(s) updated");
              resolve('Done');
            });
        });
    });
}

function select(){
    return new Promise(function(resolve, reject) {
        var mysql = require('mysql');
        var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "seanwang1327!",
        database: "mydb"
        });
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * FROM test3", function (err, result, fields) {
              if (err) throw err;     
              var data = new Array(8);
              // Loop to create 2D array using 1D array 
              for (var i = 0; i < data.length; i++) { 
                  data[i] = new Array(result.length);
                } 
            // Loop to initilize 2D array elements. 
            for (var i = 0; i < 8; i++) { 
                for (var j = 0; j < result.length; j++) {
                    if (i==0){
                        data[i][j] = result[j].Image; 
                        }
                    else if (i==1){
                        data[i][j] = result[j].Title; 
                        }
                    else if (i==2){
                        data[i][j] = result[j].Director; 
                        }
                    else if (i==3){
                        data[i][j] = result[j].Rating; 
                        }
                    else if (i==4){
                        data[i][j] = result[j].Shelf; 
                        }
                    else if (i==5){
                        data[i][j] = result[j].dateWatched; 
                        }
                    else if (i==6){
                        data[i][j] = result[j].dateAdded; 
                        }
                    else if (i==7){
                        data[i][j] = result[j].id;
                    }
                    }
                }
                jsonData = {
                    poster:data[0],
                    title:data[1],
                    director:data[2],
                    rating: data[3],
                    shelf: data[4],
                    dateWatched: data[5],
                    dateAdded: data[6],
                    id: data[7]
                }
            resolve(jsonData);
            });
          });          
      }); 
} 

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

