/* jshint -W097 */
'use strict';

describe('common', function () {
    var combinations, game;
    beforeEach(function () {
        module('pokerOnDices.logic');
        module('pokerOnDices.combinations');
        inject(function (GameLogic, Combinations) {
            game = GameLogic;
            game.addPlayer('me');
            game.initDices(5);
            combinations = Combinations;
        });
    });

    it('school combination 5x1', function () {
        var school = new combinations.School('1', 1);
        expect(school.title).toBe('1');
        expect(school.value).toBe(1);
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(2);
    });

    it('school combination 0x5', function () {
        var school = new combinations.School('5', 5);
        expect(school.title).toBe('5');
        expect(school.value).toBe(5);
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(-15);
    });

    it('school combination 3x3', function () {
        var school = new combinations.School('3', 3);
        expect(school.title).toBe('3');
        expect(school.value).toBe(3);
        game.dices[0].value = 3;
        game.dices[1].value = 3;
        game.dices[2].value = 3;
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(0);
    });

    it('school combination 2x2', function () {
        var school = new combinations.School('2', 2);
        expect(school.title).toBe('2');
        expect(school.value).toBe(2);
        game.dices[0].value = 2;
        game.dices[1].value = 2;
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(-2);
    });

    it('school combination 4x6', function () {
        var school = new combinations.School('6', 6);
        expect(school.title).toBe('6');
        expect(school.value).toBe(6);
        game.dices[0].value = 6;
        game.dices[1].value = 6;
        game.dices[2].value = 6;
        game.dices[3].value = 6;
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(6);
    });

    it('pair combination 2x5', function () {
        var school = new combinations.Pair('pair');
        expect(school.title).toBe('pair');
        game.dices[0].value = 5;
        game.dices[1].value = 5;
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(10);
    });

    it('pair combination 2x3 and 2x6', function () {
        var school = new combinations.Pair('pair');
        expect(school.title).toBe('pair');
        game.dices[0].value = 3;
        game.dices[1].value = 3;
        game.dices[3].value = 6;
        game.dices[4].value = 6;
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(12);
    });

    it('two pair combination 2x3 and 2x6', function () {
        var school = new combinations.TwoPair('two pair');
        expect(school.title).toBe('two pair');
        game.dices[0].value = 3;
        game.dices[1].value = 3;
        game.dices[3].value = 6;
        game.dices[4].value = 6;
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(18);
    });

    it('two pair combination 4x2', function () {
        var school = new combinations.TwoPair('two pair');
        expect(school.title).toBe('two pair');
        game.dices[0].value = 2;
        game.dices[1].value = 2;
        game.dices[3].value = 2;
        game.dices[4].value = 2;
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(8);
    });

    it('triangle combination 3x3', function () {
        var school = new combinations.Triangle('triangle');
        expect(school.title).toBe('triangle');
        game.dices[0].value = 3;
        game.dices[1].value = 3;
        game.dices[2].value = 3;
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(9);
    });

    it('quad combination 6x6', function () {
        var school = new combinations.Quad('quad');
        expect(school.title).toBe('quad');
        game.dices[0].value = 6;
        game.dices[1].value = 6;
        game.dices[2].value = 6;
        game.dices[3].value = 6;
        var result = school.getPossibleResult(game.dices);
        expect(result).toBe(24);
    });

});