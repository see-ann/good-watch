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
  var sql = "CREATE TABLE test3 (id INT AUTO_INCREMENT PRIMARY KEY, Image VARCHAR(255), Title VARCHAR(255), Director VARCHAR(255), Rating VARCHAR(255), "+
  "Shelf VARCHAR(255), dateWatched VARCHAR(255), dateAdded VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});