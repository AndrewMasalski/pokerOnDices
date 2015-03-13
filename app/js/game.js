/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.logic', ['pokerOnDices.combinations'])
    .service('GameLogic', ['Combinations', function (Combinations) {
        var Dice = function () {
            this.isLocked = false;
            this.value = 1;
            this.num = 1;

            this.switchLocked = function () {
                this.isLocked = !this.isLocked;
            };

            this.roll = function () {
                if (this.isLocked) {
                    return;
                }
                this.value = Math.round(Math.random() * 5) + 1;
                switch (this.value) {
                    case 1:
                        this.num = 'one';
                        break;
                    case 2:
                        this.num = 'two';
                        break;
                    case 3:
                        this.num = 'three';
                        break;
                    case 4:
                        this.num = 'four';
                        break;
                    case 5:
                        this.num = 'five';
                        break;
                    case 6:
                        this.num = 'six';
                        break;
                }
            };
        };

        var Player = function (name) {
            this.name = name;
            this.schoolResults = [];
            this.results = [];
            this.schoolPossibleResults = [];
            this.possibleResults = [];
            this.rollsLeft = 3;
            this.setResult = function (index) {
                this.results[index] = this.possibleResults[index];
            };
            this.setSchoolResult = function (index) {
                this.schoolResults[index] = this.schoolPossibleResults[index];
            };
            this.getSchoolResult = function () {
                var sum = _.sum(this.schoolResults);
                return sum < 0 ? sum * 10 : sum;
            };
            this.isRollEnabled = function () {
                return this.rollsLeft > 0;
            };
        };

        this.currentPlayer = null;
        this.players = [];
        this.dices = [];
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
            new Combinations.Quad('каре'),
            new Combinations.SmallStreet('малый стрит'),
            new Combinations.BigStreet('большой стрит'),
/*
            {title: 'фул хаус'},
            {title: 'покер'},
            {title: 'шанс'}
*/
        ];
        this.initDices = function (num) {
            num = num || 5;
            for (var i = 0; i < num; i++) {
                this.dices.push(new Dice());
            }
            this.updatePossibleResults();
        };
        /**
         * Only for testing purposes
         * @param num
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
                this.currentPlayer = player;
            }
            this.players.push(player);
        };
        this.rollText = function () {
            var suffix = '';
            if (!!this.currentPlayer) {
                return this.currentPlayer.rollsLeft > 0 ? 'Roll (' + this.currentPlayer.rollsLeft + ')' : 'Pick';
            }
            return 'Roll' + suffix;
        };
        this.getDicesSum = function () {
            return _.reduce(this.dices, function (sum, n) {
                return sum + n.value;
            }, 0);
        };
        this.makeRoll = function () {
            var self = this;
            self.isRollEnabled = false;
            var notLockedDices = _.filter(self.dices, {isLocked: false});
            _.forEach(notLockedDices, function (elem, index) {
                notLockedDices[index].isRotating = !notLockedDices[index].isRotating;
                notLockedDices[index].roll();
            });
            this.currentPlayer.rollsLeft--;
            this.updatePossibleResults();
        };
        this.updatePossibleResults = function () {
            var self = this;
            this.currentPlayer.schoolPossibleResults.length = 0;
            this.currentPlayer.possibleResults.length = 0;
            _.forEach(this.school, function (comb) {
                var possibleResult = comb.getPossibleResult(self.dices);
                self.currentPlayer.schoolPossibleResults.push(possibleResult !== 0 ? possibleResult : null);
            });
            _.forEach(this.combinations, function (comb) {
                var possibleResult = comb.getPossibleResult(self.dices);
                self.currentPlayer.possibleResults.push(possibleResult !== 0 ? possibleResult : null);
            });
        };

    }]);

