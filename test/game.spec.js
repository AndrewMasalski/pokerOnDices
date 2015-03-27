/* jshint -W097 */
'use strict';

describe('game', function () {
    var game, $timeout;
    beforeEach(function () {
        module('pokerOnDices.logic');
        inject(function (_$timeout_, GameLogic, Player) {
            $timeout = _$timeout_;
            game = GameLogic;
            game.start({players: [new Player({name: 'me', id: 1}), new Player({name: '!me', id: 2})]});
        });
    });

    it('game.currentPlayer', function () {
        expect(game.currentPlayer.name).toBe('me');
    });

    it('game.combinations', function () {
        expect(game.school.length).toBe(6);
        expect(game.combinations.length).toBe(9);
    });

    it('game dices', function () {
        expect(game.dices.length).toBe(5);
    });

    it('game.makeRoll()', function (done) {
        expect(game.currentPlayer.rollsLeft).toBe(3);
        game.makeRoll()
            .then(function () {
                expect(game.currentPlayer.rollsLeft).toBe(2);
            }).then(done, done);
        $timeout.flush(1000);
    });

    it('initial possibleResults', function () {
        game.updatePossibleResults();
        expect(game.currentPlayer.schoolPossibleResults[0]).toBe('+2');
        expect(game.currentPlayer.possibleResults[1]).toBe(4);
    });

    it('game.possibleResults', function (done) {
        game.makeRoll()
            .then(function () {
                game.setDiceValues([2, 2, 2, 3, 4]);
                game.updatePossibleResults();
                expect(game.currentPlayer.possibleResults[2]).toBe(6 * 2);
                expect(game.currentPlayer.schoolPossibleResults[1]).toBe(0);
            })
            .then(done, done);
        $timeout.flush(1000);
    });

    it('game.currentPlayer.rollsLeft', function (done) {
        expect(game.currentPlayer.rollsLeft).toBe(3);
        game.makeRoll()
            .then(function () {
                expect(game.currentPlayer.rollsLeft).toBe(2);
            })
            .then(done, done);
        $timeout.flush(1000);
    });

    it('game.possibleResults doubling', function (done) {
        game.makeRoll()
            .then(function () {
                game.setDiceValues([3, 2, 4, 6, 4]);
                game.updatePossibleResults();
                expect(game.currentPlayer.possibleResults[0]).toBe(8 * 2);
                expect(game.currentPlayer.schoolPossibleResults[3]).toBe(-4);
            })
            .then(done, done);
        $timeout.flush(1000);
    });

    it('player.getSchoolTotal', function () {
        game.currentPlayer.schoolResults = [-3, 3];
        expect(game.currentPlayer.getSchoolTotal()).toBe(0);
    });

    it('player.getSchoolTotal negative', function () {
        game.currentPlayer.schoolResults = [-3, 1];
        expect(game.currentPlayer.getSchoolTotal()).toBe(-20);
    });

    it('player results and rolls left', function (done) {
        game.makeRoll()
            .then(function () {
                game.setDiceValues([3, 2, 4, 6, 4]);
                game.updatePossibleResults();
                expect(game.currentPlayer.possibleResults[0]).toBe(8 * 2);
                expect(game.currentPlayer.rollsLeft).toBe(2);
                game.pickResult(0);
                expect(game.players[0].results[0]).toBe(8 * 2);
                expect(game.players[0].rollsLeft).toBe(3);
            })
            .then(done, done);
        $timeout.flush(1000);
    });

    it('player.locked reset', function () {
        game.dices[0].switchLocked();
        game.dices[1].switchLocked();
        expect(game.dices[0].isLocked).toBeTruthy();
        expect(game.dices[1].isLocked).toBeTruthy();
        game.pickResult(0);
        expect(game.dices[0].isLocked).toBeFalsy();
        expect(game.dices[1].isLocked).toBeFalsy();
    });

    it('poker on first roll', function (done) {
        game.makeRoll()
            .then(function () {
                game.setDiceValues([5, 5, 5, 5, 5]);
                game.updatePossibleResults();
                expect(game.currentPlayer.possibleResults[game.combinations.length - 2]).toBe(100);
            })
            .then(done, done);
        $timeout.flush(1000);
    });

    it('poker on second roll', function (done) {
        game.makeRoll()
            .then(function () {
                return game.makeRoll();
            })
            .then(function () {
                game.setDiceValues([4, 4, 4, 4, 4]);
                game.updatePossibleResults();
                expect(game.currentPlayer.possibleResults[game.combinations.length - 2]).toBe(70);
            })
            .then(done, done);
        $timeout.flush(1000);
    });

    it('game done', function () {
        game.currentPlayer.schoolResults = [1, 1, 1, 1, 1, 1];
        game.currentPlayer.results = [1, 1, 1, 1, 1, 1, 1, 1, 1];
        game.setNextPlayer();
        game.currentPlayer.schoolResults = [1, 1, 1, 1, 1, 1];
        game.currentPlayer.results = [1, 1, 1, 1, 1, 1, 1, 1, 1];
        game.setNextPlayer();
        expect(game.done).toBeTruthy();
        expect(game.players[0].getTotal()).toBe(15);
        expect(game.players[1].getTotal()).toBe(15);
    });

    it('game not done', function () {
        game.players[0].schoolResults = [1, 1, 1, 1, 1, 1];
        game.players[0].results = [1, 1, 1, 1, 1, 1, 1, 1, 1];
        game.players[1].schoolResults = [1, 1, 1, 1, 1, 1];
        game.players[1].results = [1, 1, 1, 1, 1, 1, 1, 1];
        game.setNextPlayer();
        expect(game.done).toBeFalsy();
        expect(game.players[0].getTotal()).toBe(15);
        expect(game.players[1].getTotal()).toBe(14);
    });

    var compareWithState = function (state1, state2) {
        expect(state2.isDone).toBe(state1.isDone);
        // check dices
        expect(state2.dices.length).toBe(state1.dices.length);
        var getDiceValue = function (sum, cur) {
            return sum + cur.value;
        };
        var stateDices = _.reduce(state2.dices, getDiceValue, '');
        var gameDices = _.reduce(state1.dices, getDiceValue, '');
        expect(stateDices).toBe(gameDices);
        // check players
        var getPlayerValue = function (sum, cur) {
            var getResult = function (allRes, curRes) {
                return allRes + curRes;
            };
            var results = _.reduce(cur.results, getResult, '');
            var reduce = _.reduce(cur.schoolResults, getResult, '');
            return cur.isCurrent + sum + results + reduce;
        };
        var statePlayers = _.reduce(state2.players, getPlayerValue, '');
        var gamePlayers = _.reduce(state1.players, getPlayerValue, '');
        expect(statePlayers).toBe(gamePlayers);
    };

    it('game.getState()', function () {
        game.players[0].schoolResults = [1, 1, 1, 1, 1, 1];
        game.players[0].results = [1, 1, 1, 1, 1, 1, 1, 1, 1];
        var state = game.getState();
        compareWithState(game, state);
    });

    it('game.isUndoEnabled()', function (done) {
        game.pickResult(0);
        expect(game.isUndoEnabled()).toBeTruthy();
        game.makeRoll().then(function () {
            expect(game.isUndoEnabled()).toBeFalsy();
        }).finally(done);
        $timeout.flush(1000);
    });

    it('game.undo()', function () {
        game.pickResult(0);
        var beforeState = game.getPrevious();
        expect(beforeState.players[1].results.length).toBe(0);
        game.undo();
        compareWithState(beforeState, game);
    });


});