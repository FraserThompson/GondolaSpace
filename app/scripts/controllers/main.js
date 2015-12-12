'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('MainCtrl', function ($scope, $state, $location, $stateParams, $http, gondola, GondolaService, UserService) {
  	var votedFlavours = {};
  	var votedVote = "";

  	$scope.api_url = 'http://45.55.61.237';
  	//$scope.api_url = 'http://localhost:3000';

  	$scope.gondola = gondola;

  	UserService.getUser(gondola.owner)
	  	.then (function (owner) {
	  		$scope.owner = owner.data;
	  	});

    $scope.getRandom = function() {
    	GondolaService.getRandom()
    		.then(function (gondola) {
    			votedVote = "";
    			votedFlavours = {};
    			$scope.gondola = gondola
    			$location.search('gondola', gondola._id)
    		});
    }

  	/***************************** GONDOLA METHODS *************************************/
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

  		GondolaService.updateGondola(id, flavours)
  			.then(function (gondola) {
  				$scope.gondola.flavour = GondolaService.getFlavour(gondola);
  			});
  	}

  	$scope.addFavorite = function (id) {
  		UserService.updateUser({'favorite': id});
  	}

	$('#myModal').on('hidden.bs.modal', function (e) {
		$state.go('home', { gondola: $scope.gondola._id }, {notify:false, reload:true});
	});
  });
