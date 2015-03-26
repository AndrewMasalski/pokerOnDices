/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.app',
    [
        'ngRoute',
        'firebase',
        'ngActivityIndicator',
        'xeditable',
        'ui.bootstrap',
        'pokerOnDices.animate',
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
    .directive("version", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                appVersion: "="
            },
            template:
                '<small class="pull-right">v0.0.6</small>'
        };
    })
    .run(['editableOptions', function (editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);

