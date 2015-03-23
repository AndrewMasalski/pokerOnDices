angular.module('pokerOnDices.auth', [])
    .service('PokerOnDicesAuth', ['$firebaseAuth', '$q',
        function ($firebaseAuth, $q) {
            /* jshint -W097 */
            'use strict';

            var authenticated = false;
            return {
                isAuthenticated: authenticated,
                doAuth: function () {
                    if (authenticated) {
                        return $q.when(authenticated);
                    }
                    var auth = $firebaseAuth(new Firebase('https://torrid-fire-8359.firebaseio.com/'));
                    return auth.$authWithCustomToken('MswGuSbxWzrGo9WePCxEk6dA0gBBCCeG2KlbSXRj').then(function () {
                        authenticated = true;
                        return true;
                    });
                }
            };
        }]);