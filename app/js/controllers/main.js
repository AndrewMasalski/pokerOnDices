/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.app')
    .controller('MainController', ['$q', '$timeout', '$location', 'GameLogic', function ($q, $timeout, $location, GameLogic) {
        var isRolling = false;
        this.game = GameLogic;
        if (this.game.players.length == 0 || this.game.dices.length == 0) {
            //$location.path('/');
            this.game.addPlayer('me');
            this.game.addPlayer('not me');
            this.game.initDices();
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
            return !isRolling
                && this.game.currentPlayer == player
                && !player.schoolResults[key]
                && !!player.schoolPossibleResults[key];
        };

        this.isPossible = function (player, key) {
            return !isRolling
                && this.game.currentPlayer == player
                && !player.results[key]
                && !!player.possibleResults[key];
        };

        this.canCrossOut = function (player, key) {
            return !isRolling
                && player.rollsLeft < 3
                && this.game.currentPlayer == player
                && !player.results[key];
                //&& !player.schoolPossibleResults[key];
        };

    }]);

