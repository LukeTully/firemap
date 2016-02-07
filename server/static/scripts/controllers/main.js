'use strict';

/**
 * @ngdoc function
 * @name mapprojectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mapprojectApp
 */
angular.module( 'mapprojectApp' )
  .controller( 'MainCtrl', function ( $scope, FiresFact, StringsFact ) {

    $scope.messages = {
      loading: false,
      errors: null
    };

    $scope.globalStrings = StringsFact.getStrings();

    // Can be moved to template
    $scope.fireConfig = {
      src: $scope.globalStrings.provinces[0],
      date: 1973,
      fireType: $scope.globalStrings.fireTypes[0]
    };

    $scope.getFires = function ( params ) {
      $scope.messages.loading = true;
      $scope.messages.emptyDataset = false;
      $scope.messages.errors = null;
      //console.log(params);
      var payload = {
        src: params.src.key,
        date: params.date,
        fireType: params.fireType.FIRE_TYPE
      };
      console.log(payload);
      FiresFact.get( payload, function ( data ) {
        if (data.rows) {
          $scope.fireData = data.rows;
        }
         else {
          $scope.fireData = data;
        }
        if (data.errors){
          $scope.messages.errors = data.errors;
        }
        $scope.messages.loading = false;
        if ( data.length == 0 ) {
          $scope.messages.emptyDataset = true;
        } else {
          $scope.messages.emptyDataset = false;
        }

      } );
    };


    // Implement async return of data


  } );
