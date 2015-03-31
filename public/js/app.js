var app = angular.module('refViewer', ['ui.router'])
  .config([
    '$stateProvider', 
    '$urlRouterProvider', 
    '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider){
      var root = 'https://quidapi.herokuapp.com/';

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
    $scope.timeslots = ["9:00am", "9:40am", "10:40am", "11:20am"];
    $scope.message = 'yo';

    var g = games.data;
    
    $scope.games = g.reduce(function (mapped, item) {
      if (!mapped[item.timeslot]) {
        mapped[item.timeslot] = [];
      }

      mapped[item.timeslot].push(item);
      return mapped;
    }, []);
  }]);