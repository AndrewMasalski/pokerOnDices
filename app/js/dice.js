/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.dice', [])
    .factory('Dice', function () {
        return function () {
            this.isLocked = false;
            this.value = 1;
            this.num = 1;

            this.switchLocked = function () {
                this.isLocked = !this.isLocked;
            };

            this.roll = function () {
                if (this.isLocked) {
                    return;
                }
                this.value = Math.round(Math.random() * 5) + 1;
                switch (this.value) {
                    case 1:
                        this.num = 'one';
                        break;
                    case 2:
                        this.num = 'two';
                        break;
                    case 3:
                        this.num = 'three';
                        break;
                    case 4:
                        this.num = 'four';
                        break;
                    case 5:
                        this.num = 'five';
                        break;
                    case 6:
                        this.num = 'six';
                        break;
                }
            };
        };

    });