/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.app')
    .controller('MainController', ['$q', '$timeout', '$location', 'GameLogic', function ($q, $timeout, $location, GameLogic) {
        var isRolling = false;
        this.game = GameLogic;
        if (this.game.players.length == 0 || this.game.dices.length == 0) {
            $location.path('/');
        }

        this.isRollEnabled = function () {
            var currentPlayerAble = !!this.game.currentPlayer && this.game.currentPlayer.isRollEnabled();
            return !isRolling && currentPlayerAble;
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

        this.getState = function () {
            return {
                lockedCount: _.filter(this.getDices(), {isLocked: true}).length,
                result: this.game.getDicesSum()
            };
        };

        this.onRollClick = function () {
            var self = this;
            isRolling = true;
            var elements = angular.element('.die').not('.locked');
            this.game.makeRoll(elements);
            $timeout(function () {
                isRolling = false;
                console.log('rolled: [' + _.pluck(self.game.dices, 'value') + ']');
            }, 1000);
        };

        this.isSchoolPossible = function (player, key) {
            return this.game.currentPlayer == player &&
                !this.game.currentPlayer.schoolResults[key] &&
                !!this.game.currentPlayer.schoolPossibleResults[key];
        };

        this.isPossible = function (player, key) {
            return this.game.currentPlayer == player &&
                !this.game.currentPlayer.results[key] &&
                !!this.game.currentPlayer.possibleResults[key];
        };
    }]);

