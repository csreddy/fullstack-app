'use strict';

angular.module('fullstackApp')
    .config(function($routeProvider) {
        $routeProvider.
        when('/reports', {
            templateUrl: 'app/report/report.html',
            controller: 'reportCtrl',
            reloadOnSearch: false,
            resolve: {
                config: ['Config',
                    function(Config) {
                        return Config.get();
                    }
                ]
            }
        });

    });