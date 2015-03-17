angular.module('pokerOnDices.app',
    [
        'ngRoute',
        'firebase',
        'ngActivityIndicator',
        'animate',
        'xeditable',
        'ui.bootstrap',
        'pokerOnDices.logic',
        'ui.checkbox'
    ])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        //$locationProvider.hashPrefix('!');
        $routeProvider
            .when("/", {templateUrl: "./partials/home.html"})
            .when("/game/:gameid", {templateUrl: "./partials/main.html"})
            .otherwise({
                redirectTo: '/'
            });
    }])
    .run(['editableOptions', function (editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);

