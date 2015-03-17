angular.module('pokerOnDices.app')
    .controller('HomeController', ['$rootScope', '$scope', '$timeout', '$location', '$firebaseObject', '$firebaseArray', '$firebaseAuth', 'GameLogic', 'Player',
        function ($rootScope, $scope, $timeout, $location, $firebaseObject, $firebaseArray, $firebaseAuth, GameLogic, Player) {
            /* jshint -W097 */
            'use strict';

            $rootScope.AILoading = true;
            this.options = null;
            this.isError = false;
            this.isSaving = false;
            this.newPlayer = '';

            var self = this;
            var playersObj, optionsObj;
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
                var auth = $firebaseAuth(new Firebase('https://torrid-fire-8359.firebaseio.com/players'));
                return auth.$authWithPassword({email: 'star.mnk@gmail.com', password: '00sloo'})
                    .then(function () {
                        optionsObj = $firebaseObject(new Firebase('https://torrid-fire-8359.firebaseio.com/options'));
                        return optionsObj.$loaded().then(function (data) {
                            var options = data.$value;
                            if (options === null) {
                                optionsObj.$value = {isDoubleFirstRoll: false};
                                return optionsObj.$bindTo($scope, 'options')
                                    .then(function () {
                                        self.options = $scope.options;
                                        return optionsObj.$save();
                                    });
                            }
                            return optionsObj.$bindTo($scope, 'options').then(function () {
                                self.options = $scope.options;
                            });
                        });
                    })
                    .then(function () {
                        playersObj = $firebaseArray(new Firebase('https://torrid-fire-8359.firebaseio.com/players'));
                        return playersObj.$loaded();
                    })
                    .then(function (data) {
                        _.forEach(data, function (playerData) {
                            loadedPlayers.push(new Player(playerData.$value));
                        });
                        if (loadedPlayers.length === 0) {
                            _.forEach(sampleNames, function (name) {
                                var player = new Player(name);
                                loadedPlayers.push(player);
                                playersObj.$add(name);
                            });
                        }
                    })
                    .then(done, onError)
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
                playersObj.$add(this.newPlayer).then(done, onError);
                this.newPlayer = '';
            };

            this.removePlayer = function (index) {
                loadedPlayers.splice(index, 1);
                playersObj.$remove(playersObj[index]).then(done, onError);
            };

            this.getCheckedPlayers = function () {
                return _.filter(loadedPlayers, function (player) {
                    return player.isChecked;
                });
            };

            this.go = function (path) {
                var self = this;
                this.game = GameLogic;
                this.game.initDices();
                _.forEach(this.getCheckedPlayers(), function (player) {
                    self.game.addPlayer(player.name);
                });

                $location.path(path + "/" + 1);
            };

            this.closeError = function () {
                self.err = null;
                self.isError = false;
            };

            authAndLoadData();
        }]);