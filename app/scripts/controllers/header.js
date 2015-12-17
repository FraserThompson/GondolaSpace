'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('HeaderCtrl', function ($rootScope, $scope, $state, $timeout, Notification, ezfb, GondolaService, UserService) {
  	$rootScope.LOGGED_IN_USER = {};
  	$scope.loginStatus = {};

  	 /***************************** FACEBOOK METHODS *************************************/
  	// Login to Facebook
	$scope.login = function () {
	    ezfb.login(function (res1) {
	      if (res1.authResponse) {
	      	$rootScope.signedRequest = res1.authResponse.signedRequest;
			UserService.createUser();
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
				$rootScope.LOGGED_IN_USER = user.data;
				Notification.success('Successfully logged in as ' + $rootScope.LOGGED_IN_USER._id);
				console.log($rootScope.LOGGED_IN_USER._id);
				if (!user.data.pic){
					Notification.warning('You should set a profile pic.');
				}
			});
	}

  	// Uploads a new Gondola
	$scope.uploadGondola = function () {
		if ($rootScope.LOGGED_IN_USER.pic == ''){ 
			Notification.error('You need a profile pic before you can submit a gondola.');
		 	return;
		}
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
