/**
 * Created by Luke on 11-22-2014.
 */

var express = require( "express" );
var mysql = require( "mysql" ); // Maybe use orm?
var orm = require( "orm" );
var compress = require( "compression" );
var app = express();

var baseUrl = "/computermapping/fires";

var connection = mysql.createConnection( {
  host: '127.0.0.1',
  user: 'webrenos',
  password: '2o;2R297_1Ny',
  database: 'fire',
  port: '3306'
} );
connection.connect();
app.use( compress( {threshold: 1} ) );
app.use("/computermapping", express.static( __dirname + '/static' ) );

app.get( baseUrl, function ( req, res ) {
  if ( parseInt(req.query.date) > 1949 && parseInt(req.query.date) < 2013 ) {
    var date = parseInt( req.query.date );
    if ( req.query.srcagency && req.query.type ) {
      connection.query( "SELECT * FROM fires WHERE YEAR_ = ? AND SRC_AGENCY = ? AND FIRE_TYPE = ?", [date, req.query.srcagency, req.query.type], function ( err, rows, fields ) {

        if ( rows.length == 0 ) {
          connection.query( "SELECT * FROM fires WHERE YEAR_ = ? AND SRC_AGENCY = ?", [date, req.query.srcagency], function ( err, rows, fields ) {


            res.send( {
              errors: ["No fires were found of the type " + req.query.type],
		rows: rows
            } );
          } );
        } else {
          res.send( JSON.stringify( rows ) );
        }

      } );
    } else if ( req.query.srcagency ) {
      connection.query( "SELECT * FROM fires WHERE YEAR_ = ? AND SRC_AGENCY = ?", [date, req.query.srcagency], function ( err, rows, fields ) {
        res.send( JSON.stringify( rows ) );
      } );
    } else {
      connection.query( "SELECT * FROM fires WHERE YEAR_ = ?", [date], function ( err, rows, fields ) {
        res.send( JSON.stringify( rows ) );
      } );

    }
  } else {
	res.send({errors: ["Please enter a valid date"]});
}


} );


//

//});
//
//app.get(baseUrl + "/:date/:SRCAG/:firetype",function (){
//  connection.query("SELECT * FROM fires WHERE YEAR_ = ? AND SRC_AGENCY = ? AND FIRE_TYPE = ?", [req.params.date,req.params.SRCAG,req.params.firetype], function (err,rows,fields){
//    res.send(JSON.stringify(rows));
//  });
//});
//
//app.get(baseUrl + "/:date/:firetype",function (){
//  connection.query("SELECT * FROM fires WHERE YEAR_ = ? AND FIRE_TYPE = ?", [req.params.date,req.params.firetype], function (err,rows,fields){
//    res.send(JSON.stringify(rows));
//  });
//});


app.listen( "3000" ); //Needs to be changed on deployment
