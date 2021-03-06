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
    'ui.bootstrap',
    'ui-notification',
    'pw.canvas-painter'
  ])
  .run(function ($rootScope) {
    $rootScope.api_url = 'https://api.gondola.space';
    // $rootScope.api_url = 'http://localhost:3000';
  })
  .config(function ($stateProvider, $urlRouterProvider, NotificationProvider, ezfbProvider) {
    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'left',
        positionY: 'bottom'
    });

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
                return GondolaService.getSpecific($stateParams.gondola);
              } else {
                return GondolaService.getRandom();
            }
          }
        },
        onEnter: function($location, gondola) {
          if (gondola){
            $location.search('gondola', gondola._id)
          }
        }
      })
      .state('profile', {
        url: '/profile/:id',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        resolve: { 
          user: function(UserService, $stateParams) {
            console.log($stateParams.id);
            return UserService.getUser($stateParams.id)
          }
        }
      });
  });
