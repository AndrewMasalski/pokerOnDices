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
                var pairValues = [];
                _.forEach(grouped, function (group, key) {
                    if (group.length > 1) {
                        pairValues.push(Number(key));
                    }
                });
                if (pairValues.length == 0) {
                    return null;
                }
                return _.max(pairValues) * 2;
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

        var StreetCombination = function (title, street) {
            Combination.call(this, title);
            this.getPossibleResult = function (dices) {
                var dicesValues = _.map(dices, 'value');
                //var street = [1, 2, 3, 4, 5];
                var values = _.intersection(dicesValues, street);
                if (values.length < 5) {
                    return null;
                }
                return _.reduce(values, function (sum, val) {
                    return sum + val;
                }, 0);
            };

        };
        inherit(StreetCombination, Combination);

        var SmallStreetCombination = function (title) {
            StreetCombination.call(this, title, [1, 2, 3, 4, 5]);
        };
        inherit(SmallStreetCombination, StreetCombination);

        var BigStreetCombination = function (title) {
            StreetCombination.call(this, title, [2, 3, 4, 5, 6]);
        };
        inherit(BigStreetCombination, StreetCombination);

        var FullHouseCombination = function (title) {
            Combination.call(this, title);
            this.getPossibleResult = function (dices) {
                var isPoker = _.uniq(dices, 'value').length === 1;
                var grouped = _.groupBy(dices, function (dice) {
                    return dice.value;
                });
                var keys = _.map(_.keys(grouped), function (key) {
                    return Number(key);
                });
                if (keys.length != 2 && !isPoker) {
                    return null;
                }
                return _.reduce(dices, function (sum, dice) {
                    return sum + dice.value;
                }, 0);
            };

        };
        inherit(FullHouseCombination, Combination);

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

        var PokerCombination = function (title) {
            Combination.call(this, title);
            this.getPossibleResult = function (dices) {
                var isPoker = _.uniq(dices, 'value').length === 1;
                if (!isPoker) {
                    return null;
                }
                return _.reduce(dices, function (sum, dice) {
                    return sum + dice.value;
                }, 0);
            };
        };
        inherit(PokerCombination, Combination);

        var ChanceCombination = function (title) {
            Combination.call(this, title);
            this.getPossibleResult = function (dices) {
                return _.reduce(dices, function (sum, dice) {
                    return sum + dice.value;
                }, 0);
            };
        };
        inherit(ChanceCombination, Combination);

        this.School = SchoolCombination;
        this.Pair = PairCombination;
        this.TwoPair = TwoPairCombination;
        this.Triangle = TriangleCombination;
        this.SmallStreet = SmallStreetCombination;
        this.BigStreet = BigStreetCombination;
        this.FullHouse = FullHouseCombination;
        this.Quad = QuadCombination;
        this.Poker = PokerCombination;
        this.Chance = ChanceCombination;
    });