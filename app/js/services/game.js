/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.logic', ['pokerOnDices.combinations', 'pokerOnDices.player', 'pokerOnDices.dice'])
    .service('GameLogic', ['$q', '$timeout', 'Combinations', 'Player', 'Dice', function ($q, $timeout, Combinations, Player, Dice) {
        var previousState = null;
        this.currentPlayer = null;
        this.players = [];
        this.dices = [];
        this.isDoubleFirstRoll = true;
        this.done = false;
        this.school = [
            new Combinations.School('1', 1),
            new Combinations.School('2', 2),
            new Combinations.School('3', 3),
            new Combinations.School('4', 4),
            new Combinations.School('5', 5),
            new Combinations.School('6', 6)
        ];
        this.combinations = [
            new Combinations.Pair('пара'),
            new Combinations.TwoPair('две пары'),
            new Combinations.Triangle('треугольник'),
            new Combinations.SmallStreet('малый стрит'),
            new Combinations.BigStreet('большой стрит'),
            new Combinations.FullHouse('фул хаус'),
            new Combinations.Quad('каре'),
            new Combinations.Poker('покер'),
            new Combinations.Chance('шанс')
        ];

        /**
         * Used for testing purposes
         * @param arr
         */
        this.setDiceValues = function (arr) {
            for (var i = 0; i < arr.length; i++) {
                this.dices[i].value = arr[i];
            }
            this.updatePossibleResults();
        };

        this.start = function (gameData) {
            var self = this;
            this.players.length = 0;
            this.dices.length = 0;
            this.currentPlayer = null;
            if (!!gameData.prev) {
                previousState = gameData.prev;
            }
            this.done = gameData.isDone;
            if (!!gameData.dices && gameData.dices.length > 0) {
                this.dices = gameData.dices.map(function (diceData) {
                    return new Dice(diceData);
                });
            } else {
                for (var i = 0; i < 5; i++) {
                    this.dices.push(new Dice());
                }
            }
            var playersData = gameData.players;
            _.forEach(playersData, function (playerData) {
                var player = new Player(playerData);
                self.players.push(player);
                if (player.isCurrent) {
                    self.currentPlayer = player;
                }
            });
            if (this.currentPlayer === null && this.done !== true) {
                var firstPlayer = this.players[0];
                firstPlayer.isCurrent = true;
                this.currentPlayer = firstPlayer;
            }
            this.updatePossibleResults();
        };

        this.makeRoll = function (delay) {
            var self = this;
            previousState = null;
            self.isRollEnabled = false;
            var notLockedDices = _.filter(self.dices, {isLocked: false});
            _.forEach(notLockedDices, function (elem, index) {
                notLockedDices[index].isRotating = !notLockedDices[index].isRotating;
            });
            var deferred = $q.defer();
            $timeout(function () {
                _.forEach(notLockedDices, function (elem, index) {
                    notLockedDices[index].roll();
                });
            }, delay / 2);
            $timeout(function () {
                self.currentPlayer.rollsLeft--;
                self.updatePossibleResults();
                deferred.resolve(notLockedDices);
            }, delay);
            return deferred.promise;
        };

        this.updatePossibleResults = function () {
            if (this.currentPlayer === null) return;
            var self = this;
            this.currentPlayer.schoolPossibleResults.length = 0;
            this.currentPlayer.possibleResults.length = 0;
            _.forEach(this.school, function (comb) {
                var possibleResult = comb.getPossibleResult(self.dices);
                if (possibleResult > 0) {
                    possibleResult = '+' + possibleResult;
                }
                self.currentPlayer.schoolPossibleResults.push(possibleResult);
            });
            _.forEach(this.combinations, function (comb) {
                var possibleResult = comb.getPossibleResult(self.dices);
                if (self.isDoubleFirstRoll && self.currentPlayer.isFirstRoll()) {
                    possibleResult *= 2;
                    if (comb instanceof Combinations.Poker && possibleResult !== 0) {
                        possibleResult -= 50;
                    }
                }
                self.currentPlayer.possibleResults.push(possibleResult !== 0 ? possibleResult : null);
            });
        };

        this.pickResult = function (index) {
            previousState = this.getState();
            this.currentPlayer.setResult(index);
            this.setNextPlayer();
        };

        this.crossOut = function (index) {
            previousState = this.getState();
            this.currentPlayer.results[index] = 0;
            this.setNextPlayer();
        };

        this.pickSchoolResult = function (index) {
            previousState = this.getState();
            this.currentPlayer.setSchoolResult(index);
            this.setNextPlayer();
        };

        this.isGameCompleted = function () {
            return _.all(this.players, function (player) {
                return player.isCompleted();
            });
        };

        this.setDicesLock = function (val) {
            _.forEach(this.dices, function (dice) {
                dice.isLocked = val;
            });
        };

        this.setNextPlayer = function () {
            var currentIndex = _.indexOf(this.players, this.currentPlayer);
            if (currentIndex === this.players.length - 1) {
                currentIndex = -1;
            }
            this.currentPlayer.endTurn();
            if (!this.isGameCompleted()) {
                this.setDicesLock(false);
                this.currentPlayer.isCurrent = false;
                this.players[currentIndex + 1].isCurrent = true;
                this.currentPlayer = this.players[currentIndex + 1];
            } else {
                this.currentPlayer.rollsLeft = 0;
                this.setDicesLock(true);
                this.done = true;
                this.currentPlayer.isCurrent = false;
                this.currentPlayer = null;
            }
        };

        this.isUndoEnabled = function () {
            return previousState !== null;
        };

        this.getState = function() {
            var state = {};
            state.isDone = this.done;
            state.dices = this.dices.map(function (dice) {
                return dice.toDb();
            });
            state.players = {};
            for (var i = 0; i < this.players.length; i++) {
                var player = this.players[i];
                state.players[player.id] = player.toDb();
            }
            return state;
        };

        this.getPrevious = function () {
            return previousState;
        };

        this.undo = function () {
            if (previousState === null) { return; }
            this.start(previousState);
            previousState = null;
        };

    }]);

