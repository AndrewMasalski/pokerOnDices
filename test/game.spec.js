/* jshint -W097 */
'use strict';

describe('common', function () {
    var game;
    beforeEach(function () {
        module('pokerOnDices.logic');
        inject(function (GameLogic) {
            game = GameLogic;
            game.addPlayer('me');
            game.initDices(5);
        });
    });

    it('game.currentPlayer', function () {
        expect(game.currentPlayer.name).toBe('me');
    });

    it('game.initDices()', function () {
        expect(game.dices.length).toBe(5);
    });

    it('game.rollText()', function () {
        expect(game.rollText()).toBe('Roll (3)');
    });

    it('game.makeRoll()', function () {
        game.makeRoll();
        expect(game.rollText()).toBe('Roll (2)');
        expect(game.getDicesSum()).toBeGreaterThan(4);
        expect(game.getDicesSum()).toBeLessThan(31);
    });

    it('initial possibleResults', function () {
        expect(game.currentPlayer.schoolPossibleResults[0]).toBe(2);
        expect(game.currentPlayer.possibleResults[1]).toBe(4);
    });

    it('game.possibleResults', function () {
        game.dices[0].value = 2;
        game.dices[1].value = 2;
        game.dices[2].value = 2;
        game.updatePossibleResults();
        expect(game.currentPlayer.possibleResults[1]).toBe(6);
        expect(game.currentPlayer.schoolPossibleResults[1]).toBe(null);
    });

});