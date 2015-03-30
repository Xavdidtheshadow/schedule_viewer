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
    $scope.timeslots = ["9:00am", "9:40am", "10:20am", "11:00am", "11:40am", "12:20pm", "1:00pm", "1:40pm", "2:20pm", "3:00pm"];
  }]);