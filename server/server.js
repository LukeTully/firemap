/**
 * Created by Luke on 11-22-2014.
 */

var express = require("express");
var mysql = require("mysql"); // Maybe use orm?
var orm = require("orm");
var compress = require("compression");
var app = express();

var baseUrl = "/computermapping/fires";

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'webrenos',
  password: '2o;2R297_1Ny',
  database: 'fire',
  port: '3306'
});
connection.connect();
app.use(compress({threshold: 1}));
app.use("/computermapping", express.static(__dirname + '/static'));

app.get(baseUrl, function (req, res) {
  if (parseInt(req.query.date) > 1949 && parseInt(req.query.date) < 2013) {
    var date = parseInt(req.query.date);

  } else if (req.query.srcagency) {
    connection.query("SELECT * FROM fires WHERE YEAR_ = ? AND SRC_AGENCY = ?", [date, req.query.srcagency], function (err, rows, fields) {
      res.send(JSON.stringify(rows));
    });
  } else {
    connection.query("SELECT * FROM fires WHERE YEAR_ = ?", [date], function (err, rows, fields) {
      if (rows.length === 0) {
        res.send({errors: ["Please enter a valid date"]});
      }
      res.send(JSON.stringify(rows));
    });

  }
});


app.listen("3000"); //Needs to be changed on deployment
