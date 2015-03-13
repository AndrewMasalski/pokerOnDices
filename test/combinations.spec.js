/* jshint -W097 */
'use strict';

describe('common', function () {
    var Comb, game;
    beforeEach(function () {
        module('pokerOnDices.logic');
        module('pokerOnDices.combinations');
        inject(function (GameLogic, Combinations) {
            game = GameLogic;
            game.addPlayer('me');
            game.initDices(5);
            Comb = Combinations;
        });
    });

    it('school combination 5x1', function () {
        var school = new Comb.School('1', 1);
        expect(school.title).toBe('1');
        expect(school.value).toBe(1);
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(2);
    });

    it('school combination 0x5', function () {
        var school = new Comb.School('5', 5);
        expect(school.title).toBe('5');
        expect(school.value).toBe(5);
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(-15);
    });

    it('school combination 3x3', function () {
        var school = new Comb.School('3', 3);
        expect(school.title).toBe('3');
        expect(school.value).toBe(3);
        game.dices[0].value = 3;
        game.dices[1].value = 3;
        game.dices[2].value = 3;
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(0);
    });

    it('school combination 2x2', function () {
        var school = new Comb.School('2', 2);
        expect(school.title).toBe('2');
        expect(school.value).toBe(2);
        game.setDiceValues([2, 2, 3, 4, 5]);
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(-2);
    });

    it('school combination 4x6', function () {
        var school = new Comb.School('6', 6);
        expect(school.title).toBe('6');
        expect(school.value).toBe(6);
        game.setDiceValues([6, 6, 6, 6, 1]);
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(6);
    });

    it('pair combination [5, 5, 1, 2, 3]', function () {
        var pair = new Comb.Pair('pair');
        expect(pair.title).toBe('pair');
        game.setDiceValues([5, 5, 1, 2, 3]);
        var result = pair.getPossibleResult(game.dices);
        expect(result).toBe(5 * 2);
    });

    it('pair combination from two pair [5, 5, 2, 2, 1]', function () {
        var pair = new Comb.Pair('pair');
        expect(pair.title).toBe('pair');
        game.setDiceValues([5, 5, 2, 2, 1]);
        var result = pair.getPossibleResult(game.dices);
        expect(result).toBe(5 * 2);
    });

    it('pair combination pick best from [3, 3, 6, 6, 1]', function () {
        var pair = new Comb.Pair('pair');
        expect(pair.title).toBe('pair');
        game.setDiceValues([3, 3, 6, 6, 1]);
        var result = pair.getPossibleResult(game.dices);
        expect(result).toBe(6 * 2);
    });

    it('pair combination from [4, 2, 5, 2, 3]', function () {
        var pair = new Comb.Pair('pair');
        expect(pair.title).toBe('pair');
        game.setDiceValues([4, 2, 5, 2, 3]);
        var result = pair.getPossibleResult(game.dices);
        expect(result).toBe(4);
    });

    it('two pair combination 2x3 and 2x6', function () {
        var twoPair = new Comb.TwoPair('two pair');
        expect(twoPair.title).toBe('two pair');
        game.setDiceValues([3, 3, 6, 6, 1]);
        var result = twoPair.getPossibleResult(game.dices);
        expect(result).toBe(3 * 2 + 6 * 2);
    });

    it('two pair combination from quad 4x2', function () {
        var twoPair = new Comb.TwoPair('two pair');
        expect(twoPair.title).toBe('two pair');
        game.setDiceValues([2, 2, 2, 2, 1]);
        var result = twoPair.getPossibleResult(game.dices);
        expect(result).toBe(2 * 4);
    });

    it('triangle combination 3x3', function () {
        var triangle = new Comb.Triangle('triangle');
        expect(triangle.title).toBe('triangle');
        game.setDiceValues([3, 3, 3, 1, 2]);
        var result = triangle.getPossibleResult(game.dices);
        expect(result).toBe(3 * 3);
    });

    it('small street combination', function () {
        var smallStreet = new Comb.SmallStreet('small street');
        expect(smallStreet.title).toBe('small street');
        game.setDiceValues([1, 2, 3, 4, 5]);
        var result = smallStreet.getPossibleResult(game.dices);
        expect(result).toBe(15);
    });

    it('failed small street combination', function () {
        var smallStreet = new Comb.SmallStreet('small street');
        expect(smallStreet.title).toBe('small street');
        game.setDiceValues([2, 2, 3, 4, 5]);
        var result = smallStreet.getPossibleResult(game.dices);
        expect(result).toBe(null);
    });

    it('big street combination', function () {
        var bigStreet = new Comb.BigStreet('big street');
        expect(bigStreet.title).toBe('big street');
        game.setDiceValues([2, 3, 4, 5, 6]);
        var result = bigStreet.getPossibleResult(game.dices);
        expect(result).toBe(20);
    });

    it('failed big street combination', function () {
        var bigStreet = new Comb.BigStreet('big street');
        expect(bigStreet.title).toBe('big street');
        game.setDiceValues([3, 3, 4, 5, 6]);
        var result = bigStreet.getPossibleResult(game.dices);
        expect(result).toBe(null);
    });

    it('full house 2x3, 3x5', function () {
        var quad = new Comb.FullHouse('full house');
        expect(quad.title).toBe('full house');
        game.setDiceValues([3, 3, 5, 5, 5]);
        var result = quad.getPossibleResult(game.dices);
        expect(result).toBe(3 * 2 + 5 * 3);
    });

    it('full house as poker 6x5', function () {
        var quad = new Comb.FullHouse('full house');
        expect(quad.title).toBe('full house');
        game.setDiceValues([6, 6, 6, 6, 6]);
        var result = quad.getPossibleResult(game.dices);
        expect(result).toBe(5 * 6);
    });

    it('quad combination 4x6', function () {
        var quad = new Comb.Quad('quad');
        expect(quad.title).toBe('quad');
        game.setDiceValues([6, 6, 6, 6, 1]);
        var result = quad.getPossibleResult(game.dices);
        expect(result).toBe(6 * 4);
    });

    it('poker combination 5x1', function () {
        var quad = new Comb.Poker('poker');
        expect(quad.title).toBe('poker');
        var result = quad.getPossibleResult(game.dices);
        expect(result).toBe(5);
    });

    it('wrong poker combination', function () {
        var quad = new Comb.Poker('poker');
        expect(quad.title).toBe('poker');
        game.setDiceValues([6]);
        var result = quad.getPossibleResult(game.dices);
        expect(result).toBe(null);
    });

    it('chance combination 1, 3, 4, 5, 6', function () {
        var quad = new Comb.Chance('chance');
        expect(quad.title).toBe('chance');
        game.setDiceValues([1, 3, 4, 5, 6]);
        var result = quad.getPossibleResult(game.dices);
        expect(result).toBe(19);
    });

});