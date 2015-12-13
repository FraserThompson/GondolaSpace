'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('ProfileCtrl', function ($rootScope, $scope, $state, $stateParams, $http, user, UserService, GondolaService) {
    $scope.user = user.data;
    $scope.favoriteGondola = {};

    GondolaService.getSpecific($scope.user.favorite)
      .then(function (gondola) {
        $scope.favoriteGondola = gondola;
      });

    GondolaService.getFromOwner($scope.user._id)
      .then(function (gondolas) {
        console.log(gondolas);
        $scope.gondolas = gondolas;
      });

  });
