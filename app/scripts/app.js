'use strict';

/**
 * @ngdoc overview
 * @name publicApp
 * @description
 * # publicApp
 *
 * Main module of the application.
 */
angular
  .module('publicApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'ezfb',
    'ui.bootstrap'
  ])
  .config(function ($stateProvider, $urlRouterProvider, ezfbProvider) {
    ezfbProvider.setLocale('en_NZ');

    ezfbProvider.setInitParams({

    appId: '156068884749797',
    version: 'v2.5'
  });  
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('home', {
        url: '/?gondola',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false,
        resolve: { 
          gondola: function(GondolaService, $stateParams) {
              if ($stateParams.gondola) {
                console.log($stateParams.gondola);
                return GondolaService.getSpecific($stateParams.gondola);
              } else {
                return GondolaService.getRandom();
            }
          }
        },
        onEnter: function($location, gondola) {
          $location.search('gondola', gondola._id)
        }
      })
      .state('profile', {
        url: '/profile/:id',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        resolve: { 
          user: function(UserService, $stateParams) {
            return UserService.getUser($stateParams.id)
          }
        }
      });
  });