'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('MainCtrl', function ($scope, $state, $stateParams, $http, GondolaService, UserService) {
  	var votedFlavours = {};
  	var votedVote = "";

  	$scope.gondola = {};
  	$scope.owner = {};

  	$scope.$watch('gondola', function(gondola, oldGondola) {
	  $state.go('home', { gondola: gondola._id }, {notify:false, reload:true});
	  votedFlavours = {};
	  votedVote = "";
	  UserService.getUser(gondola.owner)
	  	.then (function (owner) {
	  		$scope.owner = owner.data;
	  	});
	});

  	/***************************** GONDOLA METHODS *************************************/
  	// Takes an id, gets a gondola
  	$scope.getSpecificGondola = function(id) {
		GondolaService.getSpecific(id)
	  		.then(function (gondola) {
  				$scope.gondola = gondola;
			});
  	}

  	// Gets a random gondola
  	$scope.getRandomGondola = function() {
  		GondolaService.getRandom()
	  		.then(function (gondola) {
	  			$scope.gondola = gondola;
	  		});
  	}

  	// Uploads a new Gondola
	$scope.uploadGondola = function () {
		GondolaService.uploadGondola($scope.gondolaFile)
			.then (function (gondola) {
				$scope.gondola = gondola.data;
				$('#myModal').modal('hide');
			}, function (err) {
				console.log(err);
			});
	}

  	// Vote a gondola up or down
  	$scope.updateVote = function (id, voted, flavour) {
  		if ((flavour == "umami" && votedVote == "notUmami") || (flavour == "notUmami" && votedVote == "umami")){
  			return;
  		} else if (flavour == votedVote){
  			votedVote = "";
  			voted[flavour] -= 1;	
  		} else {
	  		votedVote = flavour;
	  		voted[flavour] += 1;
  		}
  		GondolaService.updateGondola(id, null, voted);
  	}

  	// Vote for flavours
  	$scope.updateFlavour = function (id, flavours, flavour) {
  		if (flavour in votedFlavours) {
  			delete votedFlavours[flavour];
  			flavours[flavour] -= 1;
  		} else {
	  		votedFlavours[flavour] = 1;
	  		flavours[flavour] += 1;
  		}
  		console.log(flavours);
  		GondolaService.updateGondola(id, flavours)
  			.then(function (gondola) {
  				console.log(gondola);
  				$scope.gondola.flavour = GondolaService.getFlavour(gondola);
  			});
  	}

  	$scope.goToProfile = function (id) {
		$state.go('profile', { id: id });
  	}

  	if ($stateParams.gondola) {
  		$scope.getSpecificGondola($stateParams.gondola);
  	} else {
  		$scope.getRandomGondola();
	}

	$('#myModal').on('hidden.bs.modal', function (e) {
		$state.go('home', { gondola: $scope.gondola._id }, {notify:false, reload:true});
	});
  });
