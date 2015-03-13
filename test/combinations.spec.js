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

    it('pair combination 2x5', function () {
        var pair = new Comb.Pair('pair');
        expect(pair.title).toBe('pair');
        game.setDiceValues([5, 5, 1, 2, 3]);
        var result = pair.getPossibleResult(game.dices);
        expect(result).toBe(5 * 2);
    });

    it('pair combination pick best from 2x3 and 2x6', function () {
        var pair = new Comb.Pair('pair');
        expect(pair.title).toBe('pair');
        game.setDiceValues([3, 3, 6, 6, 1]);
        var result = pair.getPossibleResult(game.dices);
        expect(result).toBe(6 * 2);
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

    it('big street combination', function () {
        var bigStreet = new Comb.BigStreet('big street');
        expect(bigStreet.title).toBe('big street');
        game.setDiceValues([2, 3, 4, 5, 6]);
        var result = bigStreet.getPossibleResult(game.dices);
        expect(result).toBe(20);
    });

    it('quad combination 6x6', function () {
        var quad = new Comb.Quad('quad');
        expect(quad.title).toBe('quad');
        game.setDiceValues([6, 6, 6, 6, 1]);
        var result = quad.getPossibleResult(game.dices);
        expect(result).toBe(6 * 4);
    });

});