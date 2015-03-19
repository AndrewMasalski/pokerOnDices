/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.app',
    [
        'ngRoute',
        'firebase',
        'ngActivityIndicator',
        'animate',
        'xeditable',
        'ui.bootstrap',
        'pokerOnDices.auth',
        'pokerOnDices.logic',
        'ui.checkbox',
        'base64'
    ])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        //$locationProvider.hashPrefix('!');
        $routeProvider
            .when("/", {templateUrl: "./partials/home.html"})
            .when("/game/:gameId", {templateUrl: "./partials/main.html"})
            .otherwise({
                redirectTo: '/'
            });
    }])
    .run(['editableOptions', function (editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);

