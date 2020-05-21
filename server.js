var express = require('express');
var app = express();
var path = require('path');
var fs = require("fs");
const helpers = require('./helpers');

var bodyParser = require('body-parser');
var multer  = require('multer');


app.use(express.static('public'));
// Create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.get('/', function (req, res) {
   res.sendFile( __dirname + "/views/" + "index.html" );
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.post('/process_post', function (req, res) {
    //console.log(req.file.fieldname);
    //console.log(req.file.path);
    //console.log(req.file.size);
    //console.log(req.body);
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('file');
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        console.log(req.body)
    });
})


var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

