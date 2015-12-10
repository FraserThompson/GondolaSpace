'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('ProfileCtrl', function ($scope, $state, $stateParams, $http, UserService) {
    $scope.user = {};

    UserService.getUser($stateParams.id)
      .then(function (user) {
        console.log(user);
        $scope.user = user.data;
      });
  });
