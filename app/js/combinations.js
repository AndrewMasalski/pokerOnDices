/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.combinations', [])
    .service('Combinations', function () {
        var inherit = function (child, parent) {
            child.prototype = Object.create(parent.prototype);
            child.prototype.constructor = child;
        };

        var Combination = function (title) {
            this.title = title;
            this.result = 0;
            this.getPossibleResult = function (dices) {
                throw new Error('not implemented');
            };
        };

        var SchoolCombination = function (title, value) {
            Combination.call(this, title);
            this.value = value;
            this.getPossibleResult = function (dices) {
                var result = this.value;
                var filtered = _.filter(dices, function (dice) {
                    return dice.value === result;
                });
                return (filtered.length - 3) * this.value;
            };

        };
        inherit(SchoolCombination, Combination);

        var PairCombination = function (title) {
            Combination.call(this, title);
            this.getPossibleResult = function (dices) {
                var grouped = _.groupBy(dices, function (dice) {
                    return dice.value;
                });
                var orderedKeys = _.map(_.keys(grouped), function (key) {
                    return Number(key);
                });
                return _.max(orderedKeys) * 2;
            };

        };
        inherit(PairCombination, Combination);

        var TwoPairCombination = function (title) {
            Combination.call(this, title);
            this.getPossibleResult = function (dices) {
                var grouped = _.groupBy(dices, function (dice) {
                    return dice.value;
                });
                var filtered = {};
                var isQuad = false;
                _.forEach(grouped, function (group, key) {
                    if (group.length > 1) {
                        filtered[key] = group;
                    }
                    if (group.length > 3) {
                        isQuad = true;
                    }
                });
                var orderedKeys = _.map(_.keys(filtered), function (key) {
                    return Number(key);
                });
                if (orderedKeys.length < 2) {
                    if (isQuad) {
                        return orderedKeys[0] * 4;
                    }
                    return null;
                }
                return (orderedKeys[orderedKeys.length - 1] * 2) + (orderedKeys[orderedKeys.length - 2] * 2);
            };

        };
        inherit(TwoPairCombination, Combination);


        var TriangleCombination = function (title) {
            Combination.call(this, title);
            this.getPossibleResult = function (dices) {
                var grouped = _.groupBy(dices, function (dice) {
                    return dice.value;
                });
                var value = null;
                _.forEach(grouped, function (group, key) {
                    if (group.length > 2) {
                        value = Number(key) * 3;
                    }
                });
                return value;
            };

        };
        inherit(TriangleCombination, Combination);

        var QuadCombination = function (title) {
            Combination.call(this, title);
            this.getPossibleResult = function (dices) {
                var grouped = _.groupBy(dices, function (dice) {
                    return dice.value;
                });
                var value = null;
                _.forEach(grouped, function (group, key) {
                    if (group.length > 3) {
                        value = Number(key) * 4;
                    }
                });
                return value;
            };

        };
        inherit(QuadCombination, Combination);

        this.School = SchoolCombination;
        this.Pair = PairCombination;
        this.TwoPair = TwoPairCombination;
        this.Triangle = TriangleCombination;
        this.Quad = QuadCombination;
    });