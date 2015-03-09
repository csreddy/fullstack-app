'use strict';

var app = angular.module('user.services', []);

app.service('User', ['$http', '$location', 'Flash',

    function($http, $location, Flash) {

        return {
            create: function(user) {
                return $http({
                    method: 'POST',
                    url: '/api/user/create',
                    data: user
                });
            },
            isExist: function(user) {

            },
            getUsers: function() {

            },
            getInfo: function() {
                return $http({
                    method: 'GET',
                    url: '/userinfo'
                });
            },
            getCurrentUserInfo: function() {
                return this.getInfo().then(function(response) {
                    return response.data;
                }, function(response) {
                    $location.path('/login');
                    Flash.addAlert('warning', response.data.message);
                });
            },
            login: function(userCredentials) {
                return $http({
                    method: 'POST',
                    url: '/auth/local/login',
                    data: userCredentials
                });
            },
            logout: function() {
                return $http({
                    method: 'GET',
                    url: '/auth/local/logout',
                });
            },
            saveDefaultQuery: function(searchCriteria) {
                return $http({
                    method: 'PUT',
                    url: '/api/user/savedefaultquery',
                    data: searchCriteria
                });
            }

        };
    }
]);