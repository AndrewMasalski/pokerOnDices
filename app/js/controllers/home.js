angular.module('pokerOnDices.app')
    .controller('HomeController',
    ['$rootScope', '$scope', '$timeout', '$location', '$firebaseObject', '$firebaseArray', '$base64', 'PokerOnDicesAuth', 'Player',
        function ($rootScope, $scope, $timeout, $location, $firebaseObject, $firebaseArray, $base64, PokerOnDicesAuth, Player) {
            /* jshint -W097 */
            'use strict';

            $rootScope.AILoading = true;
            this.options = null;
            this.isError = false;
            this.isSaving = false;
            this.newPlayer = '';

            var self = this;
            var playersArr;
            var loadedPlayers = [];
            var sampleNames = [
                'Сигизмунд', 'Евлампий', 'Гостомысл', 'Афиноген',
                'София', 'Оксана', 'Денис', 'Сергей', 'Андрей'
            ];
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

            var authAndLoadData = function () {
                PokerOnDicesAuth.doAuth()
                    .then(function () {
                        var optionsObj = $firebaseObject(new Firebase('https://torrid-fire-8359.firebaseio.com/options'));
                        return optionsObj.$bindTo($scope, 'options').then(function () {
                            self.options = $scope.options;
                        });
                    })
                    .then(function () {
                        playersArr = $firebaseArray(new Firebase('https://torrid-fire-8359.firebaseio.com/players'));
                        return playersArr.$loaded();
                    })
                    .then(function (data) {
                        _.forEach(data, function (playerData) {
                            loadedPlayers.push(new Player({name: playerData.$value, id: playerData.$id}));
                        });
                        if (loadedPlayers.length > 0) {
                            loadedPlayers[0].isChecked = true;
                            loadedPlayers[1].isChecked = true;
                        }
                        if (loadedPlayers.length === 0) {
                            return self.createInitialPlayers();
                        }
                    })
                    .then(done, onError);
            };

            this.getPlayers = function () {
                return loadedPlayers;
            };

            this.addNewPlayer = function () {
                var newPlayerName = this.newPlayer;
                var exists = _.find(loadedPlayers, function (player) {
                    return player.name == newPlayerName;
                });
                if (exists) {
                    onError('Такой игрок уже существует', true);
                    return;
                }
                self.isSaving = true;
                var player = new Player(this.newPlayer);
                loadedPlayers.push(player);
                playersArr.$add(this.newPlayer).then(done, onError);
                this.newPlayer = '';
            };

            this.removePlayer = function (index) {
                loadedPlayers.splice(index, 1);
                playersArr.$remove(playersArr[index]).then(done, onError);
            };

            this.getCheckedPlayers = function () {
                return _.filter(loadedPlayers, function (player) {
                    return player.isChecked;
                });
            };

            this.startGame = function () {
                var checkedPlayers = this.getCheckedPlayers();
                $rootScope.AILoading = true;
                var gamesFb = $firebaseArray(new Firebase('https://torrid-fire-8359.firebaseio.com/games'));
                var newGame = { isFirstRoll: true, players: {} };
                _.forEach(checkedPlayers, function (player) {
                    newGame.players[player.id] = player.toDb();
                });
                return gamesFb.$add(newGame).then(function (newGame) {
                    var encodedId = $base64.encode(newGame.key());
                    $location.path('/game/' + encodedId);
                }, onError);
            };

            this.createInitialPlayers = function () {
                var p = _.map(sampleNames, function (name) {
                    return playersArr.$add(name).then(function (added) {
                        var player = new Player(name, added.$id);
                        loadedPlayers.push(player);
                    });
                });
                return $q.all(p);
            };

            this.closeError = function () {
                self.err = null;
                self.isError = false;
            };

            authAndLoadData();
        }]);