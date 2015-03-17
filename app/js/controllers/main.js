/* jshint -W097 */
/* global console */
'use strict';

angular.module('pokerOnDices.app')
    .controller('MainController', ['$q', '$timeout', '$location', 'GameLogic', function ($q, $timeout, $location, GameLogic) {
        var isRolling = false;
        this.game = GameLogic;
        if (this.game.players.length === 0 || this.game.dices.length === 0) {
            //$location.path('/');
            this.game.addPlayer('me');
            this.game.addPlayer('not me');
            this.game.initDices();
            this.game.players[0].isCurrent = true;
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
                player.schoolPossibleResults[key] != null;
        };

        /* todo: move this to game logic and write unit tests */
        this.isPossible = function (player, key) {
            return !isRolling &&
                this.game.currentPlayer == player &&
                player.results[key] === undefined &&
                player.possibleResults[key] != null;
        };

        /* todo: move this to game logic and write unit tests */
        this.canCrossOut = function (player, key) {
            return !isRolling &&
                player.rollsLeft < 3 &&
                this.game.currentPlayer == player &&
                player.results[key] === undefined &&
                player.possibleResults[key] === null;
        };

    }]);

