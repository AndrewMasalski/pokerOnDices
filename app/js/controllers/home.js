/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.app')
    .controller('HomeController', ['$q', '$timeout', '$location', 'GameLogic', function ($q, $timeout, $location, GameLogic) {
        this.game = GameLogic;
        this.newPlayer = '';
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

        this.getPlayerNames = function () {
            return [
                'Сигизмунд', 'Евлампий', 'Гостомысл',
                'Ратибор', 'Афиноген',
                'Евгений', 'София', 'Оксана',
                'Денис', 'Сергей', 'Андрей'
            ]
        };

        if (!this.game.isInitialized) {
            this.game.addPlayer(this.getPlayerNames()[0]);
            this.game.addPlayer(this.getPlayerNames()[1]);
            this.game.addPlayer(this.getPlayerNames()[2]);
            this.game.initDices();
        }
    }]);