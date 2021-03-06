'use strict';

var app = angular.module('fullstackApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ngRoute',

    'search.controllers',
    'search.services',

    'bug.controllers',
    'bug.services',

    'user.controllers',
    'user.services',

    'config.controllers',
    'config.services',

    'task.controllers',
    'task.services',

    'rfe.controllers',
    'rfe.services',

    'report.controllers',

    'dashboard.controllers',

    'navbar.controllers',

    'modal.services',
    'flash.services',
    'common.services',

    // 'bugTexteditor.directive',
    'wysiHtml5.directive',
    'fileupload.directive',
    'ngProgress',
    'facet.directive',
    'ui.bootstrap',
    'hljs',
    'ngAnimate'

]);
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/goto/:id', {
            template: '',
            controller: ['$routeParams', '$location', 'Search', 'Flash',
                function($routeParams, $location, Search, Flash) {
                    console.log('goto', $routeParams);
                    Search.search({
                        q: 'id:' + $routeParams.id
                    }).success(function(response) {
                        try {
                            var url = '/' + response[1].content.kind.toLowerCase() + '/' + $routeParams.id;
                            $location.path(url).replace();
                        } catch (e) {
                            $location.path('/404').replace();
                        }
                    }).error(function(error) {
                        Flash.addAlert('danger', 'Oops! something went wrong. Reload page and try again');
                    });
                }
            ]
        })
        .when('/404', {
            templateUrl: 'components/404.html'
        })
        .otherwise({
            redirectTo: '/home'
        });
    $locationProvider.html5Mode(true).hashPrefix('');
})
// for code highlight
.config(function(hljsServiceProvider) {
    hljsServiceProvider.setOptions({
        // replace tab with 4 spaces
        tabReplace: '    '
    });
})
// for groups tree ui
.config(function(ivhTreeviewOptionsProvider) {
    ivhTreeviewOptionsProvider.set({
        defaultSelectedState: false,
        validate: true,
        // Twisties can be images, custom html, or plain text
        twistieCollapsedTpl: '<span class="glyphicon glyphicon-plus-sign"></span>',
        twistieExpandedTpl: '<span class="glyphicon glyphicon-minus-sign"></span>',
        // twistieLeafTpl: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
        twistieLeafTpl: ''
    });
})
// filter for capitalize
.filter('capitalize', function() {
    return function(input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    };
})
// trust html content
.filter('trustedHtml', ['$sce',
    function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }
])
// progress bar
.run(function($rootScope, $location, ngProgress, $anchorScroll) {
    $rootScope.$on('$routeChangeStart', function() {
        ngProgress.height('3px');
        ngProgress.color('green');
        ngProgress.start();
    });

    $rootScope.$on('$routeChangeSuccess', function() {
        ngProgress.complete();
        $location.hash();
        $anchorScroll.yOffset = 80;
        $anchorScroll();
    });
    // Do the same with $routeChangeError
})
// for debugging app performance
.factory('getWatchCount', function() {
    return function getWatchCount() {
        var total = 0;
        angular.element('.ng-scope').each(function() {

            var scope = $(this).scope();
            total += scope.$$watchers ? scope.$$watchers.length : 0;
        });
        return (total);
    };
})
// get watch count
.run(['$rootScope', 'getWatchCount',
    function($rootScope, getWatchCount) {
        $rootScope.$watch(function() {
            $rootScope.watch = getWatchCount();
        });
    }
])
// set login and registration page background
.run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function() {
        if ($location.$$path === '/login' || $location.$$path === '/register') {
            $rootScope.setBg = {
                background: '#192026'
                //  background: 'url(../assets/images/intro-bg.jpg)'
            };
        } else {
            $rootScope.setBg = {
                background: 'white'
            };
        }
    });
});