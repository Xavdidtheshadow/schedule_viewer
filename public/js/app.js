var app = angular.module('refViewer', ['ui.router'])
  .config([
    '$stateProvider', 
    '$urlRouterProvider', 
    '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider){
      var root = 'http://quidapi.herokuapp.com/';

      // generate an api call from endpoint
      gen = function(endpoint){
        return ['$http', function($http){
              return $http.get(root + endpoint);
          }];
      };

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'views/home.html',
          controller: 'MainController',
          resolve: {
            teams: gen('teams')
          }
        });

      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
  }])

  .controller('MainController', ['$scope', 'teams', function($scope, teams){
    $scope.message = 'yo';
    $scope.teams = teams.data;
  }]);