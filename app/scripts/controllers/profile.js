'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('ProfileCtrl', function ($rootScope, $scope, $timeout, $state, $stateParams, $http, user, UserService, GondolaService) {
    $scope.user = user.data;
    $scope.pic_url = $rootScope.api_url + $scope.user.pic + '?decache=' + Math.random();

    $scope.uploadProfile = function () {
      var canvas = document.getElementById("canvas");

      UserService.uploadProfile(canvas.toDataURL("image/png"))
        .then (function (user) {
          $scope.user = user.data;
          $scope.pic_url = $rootScope.api_url + $scope.user.pic + '?decache=' + Math.random();
          $state.go('profile', {id: $scope.user._id }, { reload: true });
        }, function (err) {
          console.log(err);
        });
    }

    $scope.uploadDescription = function() {
      var desc = document.getElementById("user_description").value;
      $scope.user.description = desc;
      UserService.updateUser($scope.user)
        .then (function (user) {
          $scope.user = user.data;
          $state.go('profile', {id: $scope.user._id }, { reload: true });
        }, function (err) {
          console.log(err);
        });
      }

    // GondolaService.getFavorites($scope.user.favorites)
    //   .then(function (gondolas) {
    //     $scope.fav_gondolas = gondolas;
    //   });

    GondolaService.getFromOwner($scope.user._id)
      .then(function (gondolas) {
        $scope.own_gondolas = gondolas;
      });

  });
