'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('HeaderCtrl', function ($rootScope, $scope, $state, $timeout, ezfb, GondolaService, UserService) {
  	$scope.user = {};
  	$scope.loginStatus = {};

  	 /***************************** FACEBOOK METHODS *************************************/
  	// Login to Facebook
	$scope.login = function () {
	    ezfb.login(function (res1) {
	      if (res1.authResponse) {
			UserService.createUser(res1.authResponse.signedRequest);
	        updateLoginStatus(updateApiMe);
	      } else {
	      	console.log('no auth');
	      }
	    }, {scope: 'public_profile'});
	};

	$scope.updateUser = function (update) {
		UserService.updateUser(update);
	}

	// Get whether we're logged in
	var updateLoginStatus = function (more) {
		ezfb.getLoginStatus(function (res) {
			$rootScope.signedRequest = res.authResponse.signedRequest;
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
				console.log('GOT USER');
				console.log(user);
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

  	// Uploads a new Gondola
	$scope.uploadGondola = function () {
		GondolaService.uploadGondola($scope.gondolaFile)
			.then (function (gondola) {
				$('#gondolaModal').modal('hide');
				$state.go('home', {gondola: gondola.data._id}, {'reload': true});
			}, function (err) {
				console.log(err);
			});
	}

  	updateLoginStatus(updateApiMe);
  });
