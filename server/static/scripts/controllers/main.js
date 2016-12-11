/**
 * @ngdoc function
 * @name mapprojectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mapprojectApp
 */
angular.module('mapprojectApp')
    .controller('MainCtrl', ($scope, $timeout, FiresFact, StringsFact) => {
      $scope.displayState = {
        mastHead: true,
      };
      $scope.messages = {
        loading: false,
        errors: null,
      };
      $scope.currentPos = {
        latitude: '',
        longitude: '',
      };
      $scope.setCurrentPos = function () {
        const geoLocation = navigator.geolocation;
        geoLocation.getCurrentPosition((data) => {
          $scope.currentPos.latitude = data.coords.latitude;
          $scope.currentPos.longitude = data.coords.longitude;
          $scope.$apply();
        }, (data) => {
        });
      };
      $scope.setCurrentPos();
      $scope.globalStrings = StringsFact.getStrings();
        // Can be moved to template
      $scope.fireConfig = {
        src: $scope.globalStrings.provinces[0],
        date: 1973,
      };
      let currentTimeout = null;
      $scope.debounceFires = function (params) {
        if (currentTimeout !== null) {
          $timeout.cancel(currentTimeout);
          currentTimeout = null;
        }
        currentTimeout = $timeout(() => {
          $scope.getFires(params);
        }, 500);
      };
      $scope.getFires = function (params) {
        const payload = {
          src: params.src.key,
          date: params.date,
        };
        $scope.messages.loading = true;
        $scope.messages.emptyDataset = false;
        $scope.messages.errors = null;

        FiresFact.get(payload, (data) => {
          if (data.rows) {
            $scope.fireData = data.rows;
          } else {
            $scope.fireData = data;
          }
          if (data.errors) {
            $scope.messages.errors = data.errors;
          }
          $scope.messages.loading = false;
          if (data.length === 0) {
            $scope.messages.emptyDataset = true;
          } else {
            $scope.messages.emptyDataset = false;
          }
        });
      };
    });
