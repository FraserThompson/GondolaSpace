'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('HeaderCtrl', function ($scope, $state, $timeout, ezfb, GondolaService, UserService) {
  	$scope.user = {};
  	$scope.loginStatus = {};
  	
  	$scope.api_url = 'http://45.55.61.237';
  	//$scope.api_url = 'http://localhost:3000';

  	 /***************************** FACEBOOK METHODS *************************************/
  	// Login to Facebook
	$scope.login = function () {
	    ezfb.login(function (res1) {
	      if (res1.authResponse) {
			UserService.createUser(res1.authResponse.signedRequest);
	        updateLoginStatus(updateApiMe);
	      }
	    }, {scope: 'public_profile'});
	};

	$scope.updateUser = function (update) {
		UserService.updateUser(update);
	}

	// Get whether we're logged in
	var updateLoginStatus = function (more) {
		ezfb.getLoginStatus(function (res) {
		  $scope.loginStatus = res;
		  (more || angular.noop)();
		});
	}

	// Get profile stuff
	var updateApiMe = function () {
		ezfb.api('/me', function (res) {
			$scope.apiMe = res;
			$scope.getUser($scope.apiMe.id);
		});
	}

	$scope.getUser = function (id) {
		UserService.getUser(id)
			.then(function(user) {
				$scope.user = user.data;
			});
	}

	$scope.uploadProfile = function () {
		UserService.uploadProfile($scope.profileFile)
			.then (function (user) {
				$('#profileModal').modal('hide');
				$timeout( function (){
					$scope.user.pic = user.data.pic;
				}, 1000)
			}, function (err) {
				console.log(err);
			});
	}

  	updateLoginStatus(updateApiMe);
  });
