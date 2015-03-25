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
    .animation('.rotate-flip', ['$timeout', function ($timeout) {
        return {
            setup: function (element) {
            },
            start: function (element, done) {
                return $timeout(function () {
                    done();
                }, 1000);
            }
        };
    }])
    .directive("version", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                appVersion: "="
            },
            template:
                '<small class="pull-right">v0.0.5</small>'
        };
    })
    .run(['editableOptions', function (editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);

