(function () {

'use strict';


  angular.module('pokerOnDices.app', ['ngRoute', 'animate', 'pokerOnDices.logic'])

  .config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      // routes
      $routeProvider
        .when("/", {
          templateUrl: "./partials/main.html",
          //controller: "MainController"
        })
        .otherwise({
           redirectTo: '/'
        });
    }
  ]);

}());