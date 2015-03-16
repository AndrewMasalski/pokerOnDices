/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.player', [])
    .factory('Player', function () {
        return function (name) {
            this.name = name;
            this.schoolResults = [];
            this.results = [];
            this.schoolPossibleResults = [];
            this.possibleResults = [];
            this.rollsLeft = 3;
            this.isCurrent = false;
            this.isChecked = false;

            this.isFirstRoll = function () {
                return this.rollsLeft === 2;
            };

            this.setResult = function (index) {
                this.results[index] = this.possibleResults[index];
            };

            this.setSchoolResult = function (index) {
                this.schoolResults[index] = this.schoolPossibleResults[index];
            };

            this.getSchoolTotal = function () {
                var sum = _.sum(this.schoolResults);
                return sum < 0 ? sum * 10 : sum;
            };

            this.getTotal = function () {
                return this.getSchoolTotal() + _.sum(this.results);
            };

            this.isRollEnabled = function () {
                return this.rollsLeft > 0;
            };

            this.endTurn = function () {
                this.rollsLeft = 3;
                this.possibleResults.length = 0;
                this.schoolPossibleResults.length = 0;
            };

            this.isCompleted = function () {
                var schoolCompleted = this.schoolResults.length === 6 && _.all(this.schoolResults, function (res) {
                    return res !== null;
                });

                var completed = this.results.length === 9 && _.all(this.results, function (res) {
                    return res !== null;
                });
                return schoolCompleted && completed;
            };
        };

    });