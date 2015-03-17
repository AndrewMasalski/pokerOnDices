/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.logic', ['pokerOnDices.combinations', 'pokerOnDices.player', 'pokerOnDices.dice'])
    .service('GameLogic', ['$q', '$timeout', 'Combinations', 'Player', 'Dice', function ($q, $timeout, Combinations, Player, Dice) {
        this.currentPlayer = null;
        this.players = [];
        this.dices = [];
        this.isInitialized = false;
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

        this.initDices = function (num) {
            num = num || 5;
            for (var i = 0; i < num; i++) {
                this.dices.push(new Dice());
            }
            this.isInitialized = true;
        };

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

        this.addPlayer = function (name) {
            var player = new Player(name);
            if (this.players.length === 0) {
                player.isCurrent = true;
                this.currentPlayer = player;
            }
            this.players.push(player);
        };

        this.makeRoll = function (delay) {
            var self = this;
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
            this.currentPlayer.setResult(index);
            this.setNextPlayer();
        };

        this.crossOut = function (index) {
            this.currentPlayer.results[index] = 0;
            this.setNextPlayer();
        };

        this.pickSchoolResult = function (index) {
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

    }]);

