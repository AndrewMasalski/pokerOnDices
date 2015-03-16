/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.app')
    .controller('HomeController', ['$q', '$timeout', '$location', 'GameLogic', 'Player', function ($q, $timeout, $location, GameLogic, Player) {
        this.game = GameLogic;
        this.newPlayer = '';
        this.players = [];

        this.addNewPlayer = function () {
            this.players.push(this.newPlayer);
            this.newPlayer = '';
        };

        this.removePlayer = function (index) {
            this.game.players.splice(index, 1);
        };

        this.getCheckedPlayers = function () {
            return _.filter(this.game.players, function (player) {
                return player.isChecked;
            });
        };

        this.go = function (path) {
            var self = this;
            _.forEach(this.getCheckedPlayers(), function (player) {
                self.game.addPlayer(player.name);
            });
            $location.path(path);
        };

        this.getPlayerNames = function () {
            return [
                'Сигизмунд', 'Евлампий', 'Гостомысл',
                'Ратибор', 'Афиноген',
                'Евгений', 'София', 'Оксана',
                'Денис', 'Сергей', 'Андрей'
            ];
        };

        if (!this.game.isInitialized) {
            this.players = this.getPlayerNames().map(function (name) {
                return new Player(name);
            });
            this.game.initDices();
        }
    }]);