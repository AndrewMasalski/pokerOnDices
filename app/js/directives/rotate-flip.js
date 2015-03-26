(function () {
    'use strict';

    angular.module('pokerOnDices.animate', ['ngAnimate'])
        .directive("rotateFlip", function () {
            return {
                restrict: "A",
                scope: {
                    flag: "=rotateFlip"
                },
                link: function (scope, element) {
                    scope.$watch("flag", function () {
                        element.toggleClass("rotated", scope.flag);
                    });
                }
            };
        });

}());