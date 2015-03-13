/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.app')
    .controller('HomeController', ['$q', '$timeout', '$location', 'GameLogic', function ($q, $timeout, $location, GameLogic) {
        this.game = GameLogic;
        this.newPlayer = '';
        if (!this.game.isInitialized) {
            this.game.addPlayer('me');
            this.game.addPlayer('not me');
            this.game.initDices();
        }

        this.addNewPlayer = function () {
            this.game.addPlayer(this.newPlayer);
            this.newPlayer = '';
        };
        this.removePlayer = function (index) {
            this.game.players.splice(index, 1);
        };
        this.go = function (path) {
            $location.path(path);
        };
        this.playerNames = [
            'Сигизмунд', 'Евлампий', 'Ратибор',
            'Гостомысл', 'Афиноген',
            'Евгений', 'София', 'Оксана',
            'Денис', 'Сергей', 'Андрей'
        ];
    }]);