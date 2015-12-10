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
    'ezfb'
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
        url: '/:gondola',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
      })
      .state('profile', {
        url: '/profile/:id',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      });
  });
