/**
 * Created by Luke on 11-22-2014.
 */
angular.module( 'mapprojectApp' ).service( "FireQuery", function ($http) {
  return function (){
    var date = 1950;
    var agency = '';
    this.getFires = function ( cb ) {
      this.domain = "http://obsessively.ca";
      this.apiString = "computermapping/fires";
      this.url = this.domain + "/" + this.apiString;
      this.fullUrl = this.url;
      if ( date ) {
        this.fullUrl += "?date=" + date;
      } else {
        return data = [];
      }
      if ( date && agency ) {
        this.fullUrl += "&srcagency=" + agency;
      }
      $http.get( this.fullUrl, {cache: true} )
        .success( function ( data, status, headers, config ) {
          cb( data );
        } )
        .error( function ( data, status, headers, config ) {
          console.log("Request failed");
        } );
    };
    this.setAgency = function (a){
      agency = a;
    };
    this.setDate = function (d){
      date = d;
    };

    this.setFireType = function (t){
      fireType = t;
    };
    this.getDate = function (){
      return date;
    };
    this.getFireType = function (){
      return fireType;
    };
    this.getAgency = function (){
      return agency;
    }
  }
} )
  .factory( 'FiresFact', function ( $http, FireQuery ) {
    // Return an api object
    return {
      get: function ( params, cb ) {
        var Fire = new FireQuery();
        Fire.setAgency(params.src);
        Fire.setDate(params.date);
        //Fire.setFireType(params.fireType);
        //debugger;
        Fire.getFires( function ( data ) {
          cb( data );
        } );
      }
    }
  } ).factory( 'StringsFact', function () {
    var strings = {
      provinces: [
        {name: "Manitoba", key: "MB"},
        {name: "", key: ""},
        {name: "Ontario", key: "ON"},
        {name: "New Brunswick", key: "NB"},
        {name: "Alberta", key: "AB"},
        {name: "Northwest territories", key: "NWT"},
        {name: "Quebec", key: "QC"},
        {name: "Nova Scotia", key: "NS"},
        {name: "Newfoundland & Labrador", key: "NL"},
        {name: "Saskatchewan", key: "SK"},
        {name: "British Columbia", key: "BC"},
        {name: "Yukon", key: "YT"},
        {name: "PC-BA", key: "PC-BA"}

      ]
    };
    return {

      getStrings: function () {
        return strings;
      }
    }
  } );
