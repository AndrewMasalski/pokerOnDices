/* jshint -W097 */
/* global console */
'use strict';

angular.module('pokerOnDices.app')
    .controller('MainController',
    ['$q', '$rootScope', '$timeout', '$location', '$routeParams', '$firebaseObject', '$base64', 'PokerOnDicesAuth', 'GameLogic',
        function ($q, $rootScope, $timeout, $location, $routeParams, $firebaseObject, $base64, PokerOnDicesAuth, GameLogic) {
            this.isError = false;
            this.game = GameLogic;
            this.game.dices.length = 0;

            var gamesFb;
            var rollDisabled = false;
            var self = this;
            var rollingDone = function () {
                rollDisabled = false;
            };
            var done = function () {
                $rootScope.AILoading = false;
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

            $rootScope.AILoading = true;
            var decodedGameId;
            try {
                decodedGameId = $base64.decode($routeParams.gameId);
            } catch (e) {
                onError(e);
            }
            if (!!decodedGameId) {
                PokerOnDicesAuth.doAuth().then(function () {
                    gamesFb = $firebaseObject(new Firebase('https://torrid-fire-8359.firebaseio.com/games'));
                    console.log('loading game with id: ' + decodedGameId);
                    return gamesFb.$loaded();
                }).then(function (arr) {
                    var gameData = arr[decodedGameId];
                    if (!!gameData) {
                        self.game.start(gameData);
                        done();
                    } else {
                        console.error('game not found: redirecting');
                        $location.path('#/');
                    }
                }).then(null, onError);
            } else {
                console.error('game decode error: redirecting');
                $location.path('#/');
            }

            this.isRollEnabled = function () {
                var isDone = this.game.done;
                var currentPlayerAble = !!this.game.currentPlayer && this.game.currentPlayer.isRollEnabled();
                return !isDone && !rollDisabled && currentPlayerAble;
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
                rollDisabled = true;
                this.game.makeRoll(1000)
                    .then(saveGameState)
                    .then(rollingDone, rollingDone);
            };

            this.isSchoolPossible = function (player, key) {
                return !rollDisabled && player.rollsLeft < 3 && player.isSchoolPossible(key);
            };

            this.isPossible = function (player, key) {
                return !rollDisabled && player.rollsLeft < 3 && player.isPossible(key);
            };

            this.canCrossOut = function (player, key) {
                return !rollDisabled && player.rollsLeft < 3 && player.canCrossOut(key);
            };

            this.pickSchool = function (index) {
                rollDisabled = true;
                this.game.pickSchoolResult(index);
                saveGameState().then(rollingDone, rollingDone);
            };

            this.pick = function (index) {
                rollDisabled = true;
                this.game.pickResult(index);
                saveGameState().then(rollingDone, rollingDone);
            };

            this.cross = function (index) {
                rollDisabled = true;
                this.game.crossOut(index);
                saveGameState().then(rollingDone, rollingDone);
            };

            function saveGameState() {
                gamesFb[decodedGameId].isFirstRoll = false;
                gamesFb[decodedGameId].dices = _.map(self.getDices(), function (dice) {
                    return dice.toDb();
                });
                _.forEach(self.game.players, function (player) {
                    gamesFb[decodedGameId].players[player.id] = player.toDb();
                });
                return gamesFb.$save();
            }
        }]);

