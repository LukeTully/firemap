'use strict';

/**
 * @ngdoc function
 * @name mapprojectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mapprojectApp
 */
angular.module('mapprojectApp')
    .controller('MainCtrl', function ($scope, $timeout, FiresFact, StringsFact) {
        $scope.displayState = {
          mastHead: true
        };
        $scope.messages = {
            loading: false,
            errors: null
        };

        $scope.currentPos = {
            latitude: "",
            longitude: ""
        };
        $scope.setCurrentPos = function () {
            var geoLocation = navigator.geolocation;
            geoLocation.getCurrentPosition(function successCallback(data) {


                $scope.currentPos.latitude = data.coords.latitude;
                $scope.currentPos.longitude = data.coords.longitude;
                $scope.$apply();
                console.log("current data: " + JSON.stringify(data));
                //mapConfig.currentLat = data.latitude;
                //mapConfig.currentLong = data.longitude;
            }, function errorCallback(data) {
                debugger;
                console.log("Error Happened dawg: " + JSON.stringify(data));
            });
        };
        $scope.setCurrentPos();

        $scope.globalStrings = StringsFact.getStrings();

        // Can be moved to template
        $scope.fireConfig = {
            src: $scope.globalStrings.provinces[0],
            date: 1973
        };
        var currentTimeout = null;
        $scope.debounceFires = function (params){
            if (currentTimeout !== null) {
                $timeout.cancel(currentTimeout);
                currentTimeout = null;
            }
                currentTimeout = $timeout(function(){
                    $scope.getFires(params);
                }, 500);


        };
        $scope.getFires = function (params) {

            $scope.messages.loading = true;
            $scope.messages.emptyDataset = false;
            $scope.messages.errors = null;
            //console.log(params);
            var payload = {
                src: params.src.key,
                date: params.date
            };
            console.log(payload);
            FiresFact.get(payload, function (data) {
                if (data.rows) {
                    $scope.fireData = data.rows;
                }
                else {
                    $scope.fireData = data;
                }
                if (data.errors) {
                    $scope.messages.errors = data.errors;
                }
                $scope.messages.loading = false;
                if (data.length == 0) {
                    $scope.messages.emptyDataset = true;
                } else {
                    $scope.messages.emptyDataset = false;
                }

            });
        };


        // Implement async return of data


    });
