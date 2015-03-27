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
            games: gen('games')
          }
        });

      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
  }])

  .controller('MainController', ['$scope', 'games', function($scope, games){
    $scope.message = 'yo';
    $scope.games = games.data;
  }]);