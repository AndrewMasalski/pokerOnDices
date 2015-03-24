/* jshint -W097 */
'use strict';

angular.module('pokerOnDices.dice', [])
    .factory('Dice', function () {
        return function (data) {
            this.isLocked = false;
            this.isRotating = false;
            this.value = 1;
            this.num = 1;
            if (angular.isObject(data)) {
                angular.extend(this, data);
            }

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

            // todo: make base class for both dice and player with such method
            this.toDb = function () {
                var res = {};
                for (var key in this) {
                    if (!this.hasOwnProperty(key)) continue;
                    if (angular.isFunction(this[key])) continue;
                    if (key === 'isRotating') continue;
                    res[key] = this[key];
                }
                return res;
            };

        };

    });