/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.player', [])
    .factory('Player', function () {
        return function (data) {
            this.name = 'Анонимус';
            this.schoolResults = [];
            this.results = [];
            this.schoolPossibleResults = [];
            this.possibleResults = [];
            this.rollsLeft = 3;
            this.isCurrent = false;
            this.isChecked = false;
            if (angular.isString(data)) {
                this.name = data;
            } else if (angular.isObject(data)) {
                angular.extend(this, data);
                if (angular.isObject(this.schoolResults)) {
                    this.schoolResults = objectToArray(this.schoolResults);
                }
                if (angular.isObject(this.results)) {
                    this.results = objectToArray(this.results);
                }
            }

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

            /* todo: create unit test */
            this.isSchoolPossible = function (index) {
                return this.isCurrent &&
                    this.schoolResults[index] === undefined &&
                    index in this.schoolPossibleResults &&
                    this.schoolPossibleResults[index] !== null;
            };

            /* todo: create unit test */
            this.isPossible = function (index) {
                return this.isCurrent &&
                    this.results[index] === undefined &&
                    index in this.possibleResults &&
                    this.possibleResults[index] !== null;

            };

            /* todo: create unit test */
            this.canCrossOut = function (key) {
                return this.isCurrent &&
                    this.results[key] === undefined &&
                    (!(key in this.possibleResults) || this.possibleResults[key] === null);
            };

            /* todo: create unit test */
            this.toDb = function () {
                var res = {};
                for (var key in this) {
                    if (!this.hasOwnProperty(key)) continue;
                    if (angular.isFunction(this[key])) continue;
                    if (key === 'possibleResults' || key === 'schoolPossibleResults') continue;
                    res[key] = this[key];
                }
                return res;
            };

            function objectToArray(obj) {
                var arr = [];
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        if (angular.isNumber(i)) {
                            arr[i] = obj[i];
                        } else {
                            arr.push(obj[i]);
                        }
                    }
                }
                return arr;
            }
        };

    });