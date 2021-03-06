angular.module('pokerOnDices.app')
    .controller('HomeController',
    ['$q', '$rootScope', '$scope', '$timeout', '$location', '$firebaseObject', '$firebaseArray', '$base64', 'PokerOnDicesAuth', 'Player',
        function ($q, $rootScope, $scope, $timeout, $location, $firebaseObject, $firebaseArray, $base64, PokerOnDicesAuth, Player) {
            /* jshint -W097 */
            'use strict';

            $rootScope.AILoading = true;
            this.options = null;
            this.isError = false;
            this.isSaving = false;
            this.newPlayer = '';

            var self = this;
            var playersArr, gamesArr;
            var loadedGames = [];
            var loadedPlayers = [];
            var sampleNames = [
                'Сигизмунд', 'Евлампий', 'Гостомысл', 'Афиноген',
                'София', 'Оксана', 'lk', 'antik', 'starmonkey'
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

            var getGameProgress = function (gameData) {
                var movesDone = _.reduce(gameData.players, function (sum, current) {
                    var schoolDone = _.filter(current.schoolResults, function (res) {
                        return res !== null && res !== undefined;
                    });
                    var resDone = _.filter(current.results, function (res) {
                        return res !== null && res !== undefined;
                    });
                    return sum + schoolDone.length +  resDone.length;
                }, 0);
                var playersCount = _.keys(gameData.players).length;
                var res = movesDone / (playersCount * 15) * 100;
                return Number(res).toFixed(1);
            };

            var onPlayersChanged = function (event) {
                loadedPlayers = _.map(playersArr, function (playerData) {
                    return new Player({name: playerData.$value, id: playerData.$id});
                });
                if (loadedPlayers.length === 0) {
                    return self.createInitialPlayers();
                }
            };

            var onGamesChanged = function (event) {
                loadedGames = _.map(gamesArr, function (game) {
                    var ordered = _.sortBy(game.players, function (player) {
                        var pl = new Player(player);
                        return pl.getTotal();
                    }).reverse();
                    var gamePlayers = _.reduce(ordered, function (sum, current) {
                        var pl = new Player(current);
                        return sum + (sum.length === 0 ? '' : ', ') + pl.name + ' ('+ pl.getTotal() +')';
                    }, '');
                    //console.log(game);
                    var encodedId = $base64.encode(game.$id);
                    var progress = game.isDone ? 'сыграна' : getGameProgress(game) + '%';
                    return { id: encodedId, description: gamePlayers, progress: progress };
                });
            };

            PokerOnDicesAuth.doAuth()
                .then(function () {
                    playersArr = $firebaseArray(new Firebase('https://torrid-fire-8359.firebaseio.com/players'));
                    playersArr.$watch(onPlayersChanged);
                    gamesArr = $firebaseArray(new Firebase('https://torrid-fire-8359.firebaseio.com/games'));
                    gamesArr.$watch(onGamesChanged);

                    var optionsObj = $firebaseObject(new Firebase('https://torrid-fire-8359.firebaseio.com/options'));
                    return optionsObj.$bindTo($scope, 'options').then(function () {
                        self.options = $scope.options;
                    });
                })
                .then(done, onError);

            this.getPlayers = function () {
                return loadedPlayers;
            };

            this.getGames = function () {
                return loadedGames;
            };

            this.updatePlayer = function (index, playerName) {
                playersArr[index].$value = playerName;
                //var key = playersArr.$keyAt(index);
                return playersArr.$save(playersArr[index]);
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

            this.removeGame = function (index) {
                self.isSaving = false;
                gamesArr.$remove(index).then(done, onError);
            };

            this.getCheckedPlayers = function () {
                return _.filter(loadedPlayers, function (player) {
                    return player.isChecked;
                });
            };

            this.startGame = function () {
                var checkedPlayers = this.getCheckedPlayers();
                $rootScope.AILoading = true;
                var newGame = {isFirstRoll: true, isDone: false, players: {}};
                _.forEach(checkedPlayers, function (player) {
                    newGame.players[player.id] = player.toDb();
                });
                return gamesArr.$add(newGame).then(function (newGame) {
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

        }]);