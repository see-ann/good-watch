const express = require('express');
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers');


const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "test.html" );
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

app.listen(port, () => console.log(`Listening on port ${port}...`));

app.post('/upload-profile-pic', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            console.log(res.send(req.fileValidationError));
        }
        else if (!req.file) {
             console.log(res.send('Please select an image to upload'));
        }
        else if (err instanceof multer.MulterError) {
            console.log(res.send(err));
        }
        else if (err) {
             console.log(res.send(err));
        }

        // Display uploaded image for user validation
        console.log(req.file.path);
        res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    });
});