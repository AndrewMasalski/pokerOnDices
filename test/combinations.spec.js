/* jshint -W097 */
'use strict';

describe('combinations', function () {
    var Comb, game;
    beforeEach(function () {
        module('pokerOnDices.logic');
        module('pokerOnDices.combinations');
        inject(function (GameLogic, Combinations, Player) {
            game = GameLogic;
            game.start({players: [new Player('me', 1)]});
            Comb = Combinations;
        });
    });

    it('school 1 combination [1, 1, 1, 1, 1]', function () {
        var school = new Comb.School('1', 1);
        expect(school.title).toBe('1');
        expect(school.value).toBe(1);
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(2);
    });

    it('school 5 combination [1, 1, 1, 1, 1]', function () {
        var school = new Comb.School('5', 5);
        expect(school.title).toBe('5');
        expect(school.value).toBe(5);
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(-15);
    });

    it('school 3 combination [3, 3, 3, 4, 5]', function () {
        var school = new Comb.School('3', 3);
        expect(school.title).toBe('3');
        expect(school.value).toBe(3);
        game.setDiceValues([3, 3, 3, 4, 5]);
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(0);
    });

    it('school 2 combination [2, 2, 3, 4, 5]', function () {
        var school = new Comb.School('2', 2);
        expect(school.title).toBe('2');
        expect(school.value).toBe(2);
        game.setDiceValues([2, 2, 3, 4, 5]);
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(-2);
    });

    it('school 6 combination [6, 6, 6, 6, 1]', function () {
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

    it('pair combination from [5, 3, 1, 6, 4]', function () {
        var pair = new Comb.Pair('pair');
        expect(pair.title).toBe('pair');
        game.setDiceValues([5, 3, 1, 6, 4]);
        var result = pair.getPossibleResult(game.dices);
        expect(result).toBe(null);
    });

    it('two pair combination [3, 3, 6, 6, 1]', function () {
        var twoPair = new Comb.TwoPair('two pair');
        expect(twoPair.title).toBe('two pair');
        game.setDiceValues([3, 3, 6, 6, 1]);
        var result = twoPair.getPossibleResult(game.dices);
        expect(result).toBe(3 * 2 + 6 * 2);
    });

    it('two pair combination from quad [2, 2, 2, 2, 1]', function () {
        var twoPair = new Comb.TwoPair('two pair');
        expect(twoPair.title).toBe('two pair');
        game.setDiceValues([2, 2, 2, 2, 1]);
        var result = twoPair.getPossibleResult(game.dices);
        expect(result).toBe(2 * 4);
    });

    it('triangle combination [3, 3, 3, 1, 2]', function () {
        var triangle = new Comb.Triangle('triangle');
        expect(triangle.title).toBe('triangle');
        game.setDiceValues([3, 3, 3, 1, 2]);
        var result = triangle.getPossibleResult(game.dices);
        expect(result).toBe(3 * 3);
    });

    it('small street combination [1, 2, 3, 4, 5]', function () {
        var smallStreet = new Comb.SmallStreet('small street');
        expect(smallStreet.title).toBe('small street');
        game.setDiceValues([1, 2, 3, 4, 5]);
        var result = smallStreet.getPossibleResult(game.dices);
        expect(result).toBe(15);
    });

    it('failed small street combination [2, 2, 3, 4, 5]', function () {
        var smallStreet = new Comb.SmallStreet('small street');
        expect(smallStreet.title).toBe('small street');
        game.setDiceValues([2, 2, 3, 4, 5]);
        var result = smallStreet.getPossibleResult(game.dices);
        expect(result).toBe(null);
    });

    it('big street combination [2, 3, 4, 5, 6]', function () {
        var bigStreet = new Comb.BigStreet('big street');
        expect(bigStreet.title).toBe('big street');
        game.setDiceValues([2, 3, 4, 5, 6]);
        var result = bigStreet.getPossibleResult(game.dices);
        expect(result).toBe(20);
    });

    it('failed big street combination [3, 3, 4, 5, 6]', function () {
        var bigStreet = new Comb.BigStreet('big street');
        expect(bigStreet.title).toBe('big street');
        game.setDiceValues([3, 3, 4, 5, 6]);
        var result = bigStreet.getPossibleResult(game.dices);
        expect(result).toBe(null);
    });

    it('full house [3, 3, 5, 5, 5]', function () {
        var full = new Comb.FullHouse('full house');
        expect(full.title).toBe('full house');
        game.setDiceValues([3, 3, 5, 5, 5]);
        var result = full.getPossibleResult(game.dices);
        expect(result).toBe(3 * 2 + 5 * 3);
    });

    it('full house as poker [6, 6, 6, 6, 6]', function () {
        var full = new Comb.FullHouse('full house');
        expect(full.title).toBe('full house');
        game.setDiceValues([6, 6, 6, 6, 6]);
        var result = full.getPossibleResult(game.dices);
        expect(result).toBe(5 * 6);
    });

    it('wrong full house [5, 5, 5, 5, 1]', function () {
        var full = new Comb.FullHouse('full house');
        expect(full.title).toBe('full house');
        game.setDiceValues([5, 5, 5, 5, 1]);
        var result = full.getPossibleResult(game.dices);
        expect(result).toBe(null);
    });

    it('wrong full house [5, 4, 3, 4, 5]', function () {
        var full = new Comb.FullHouse('full house');
        expect(full.title).toBe('full house');
        game.setDiceValues([5, 4, 3, 4, 5]);
        var result = full.getPossibleResult(game.dices);
        expect(result).toBe(null);
    });

    it('quad combination [6, 6, 6, 6, 1]', function () {
        var quad = new Comb.Quad('quad');
        expect(quad.title).toBe('quad');
        game.setDiceValues([6, 6, 6, 6, 1]);
        var result = quad.getPossibleResult(game.dices);
        expect(result).toBe(6 * 4);
    });

    it('quad combination from poker [6, 6, 6, 6, 6]', function () {
        var quad = new Comb.Quad('quad');
        expect(quad.title).toBe('quad');
        game.setDiceValues([6, 6, 6, 6, 6]);
        var result = quad.getPossibleResult(game.dices);
        expect(result).toBe(6 * 4);
    });

    it('poker combination [1, 1, 1, 1, 1]', function () {
        var poker = new Comb.Poker('poker');
        expect(poker.title).toBe('poker');
        var result = poker.getPossibleResult(game.dices);
        expect(result).toBe(55);
    });

    it('wrong poker combination [6, 1, 1, 1, 1]', function () {
        var poker = new Comb.Poker('poker');
        expect(poker.title).toBe('poker');
        game.setDiceValues([6]);
        var result = poker.getPossibleResult(game.dices);
        expect(result).toBe(null);
    });

    it('chance combination [1, 3, 4, 5, 6]', function () {
        var chance = new Comb.Chance('chance');
        expect(chance.title).toBe('chance');
        game.setDiceValues([1, 3, 4, 5, 6]);
        var result = chance.getPossibleResult(game.dices);
        expect(result).toBe(19);
    });

});