/* jshint -W097 */
/* global console */
'use strict';

angular.module('pokerOnDices.app')
    .controller('MainController',
    ['$q', '$rootScope', '$timeout', '$routeParams', '$base64', '$firebaseArray', 'GameLogic',
        function ($q, $rootScope, $timeout, $routeParams, $base64, $firebaseArray, GameLogic) {
            this.isError = false;
            this.game = GameLogic;
            this.game.initDices();

            var isRolling = false;
            var self = this;
            var done = function () {
                $rootScope.AILoading = false;
                self.isSaving = false;
            };
            var onError = function (errText, autoClose) {
                done();
                autoClose = autoClose || false;
                var msg = angular.isString(errText) ? errText : errText.message;
                self.isError = true;
                self.err = {text: 'Ошибка', description: msg};
                if (autoClose) {
                    $timeout(function () {
                        self.closeError();
                    }, 3000);
                }
            };

            var gameId = $routeParams.gameId;
            $rootScope.AILoading = true;
            if (!!gameId) {
                var decoded = $base64.decode(gameId);
                var gamesArr = $firebaseArray(new Firebase('https://torrid-fire-8359.firebaseio.com/games'));
                console.log('loading game with id: ' + decoded);
                var gameData;
                gamesArr.$loaded().then(function (arr) {
                    gameData = _.find(arr, function (game) {
                        return game.$id == decoded;
                    });
                    if (gameData !== null) {
                        self.game.start(gameData.players);
                        done();
                    } else {
                        onError('game with id "%s" not found ', gameId);
                    }
                }, function (err) {
                    onError('game failed to load: ' + err);
                });
            }

            this.isRollEnabled = function () {
                var isDone = this.game.done;
                var currentPlayerAble = !!this.game.currentPlayer && this.game.currentPlayer.isRollEnabled();
                return !isDone && !isRolling && currentPlayerAble;
            };

            this.getDices = function () {
                return this.game.dices;
            };

            this.getSchool = function () {
                return this.game.school;
            };

            this.getCombinations = function () {
                return this.game.combinations;
            };

            this.rollText = function () {
                var suffix = '';
                var currentPlayer = this.game.currentPlayer;
                if (!!currentPlayer) {
                    return currentPlayer.rollsLeft > 0 ? 'Roll (' + currentPlayer.rollsLeft + ')' : 'Pick';
                }
                return 'Roll' + suffix;
            };

            this.onRollClick = function () {
                var self = this;
                isRolling = true;
                this.game.makeRoll(1000)
                    .then(function (rolled) {
                        isRolling = false;
                        console.log('rolled: [' + _.pluck(rolled, 'value').join(', ') + ']');
                    });
            };

            /* todo: move this to game logic and write unit tests */
            this.isSchoolPossible = function (player, key) {
                return !isRolling &&
                    this.game.currentPlayer == player &&
                    player.schoolResults[key] === undefined &&
                    (key in player.schoolPossibleResults && player.schoolPossibleResults[key] !== null);
            };

            /* todo: move this to game logic and write unit tests */
            this.isPossible = function (player, key) {
                return !isRolling &&
                    this.game.currentPlayer == player &&
                    player.results[key] === undefined &&
                    (key in player.possibleResults && player.possibleResults[key] !== null);
            };

            /* todo: move this to game logic and write unit tests */
            this.canCrossOut = function (player, key) {
                return !isRolling &&
                    player.rollsLeft < 3 &&
                    this.game.currentPlayer == player &&
                    player.results[key] === undefined &&
                    (!(key in player.possibleResults) || player.possibleResults[key] === null);
            };

        }]);

