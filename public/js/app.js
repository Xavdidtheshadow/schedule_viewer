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
        .state('timeline', {
          url: '/',
          templateUrl: 'views/timeline.html',
          controller: 'TimelineController',
          resolve: {
            games: gen('games')
          }
        })
        .state('teams', {
          url: '/teams',
          templateUrl: 'views/teams.html',
          controller: 'TeamsController',
          resolve: {
            teams: gen('teams')
          }
        });

      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
  }])
  .run(['$rootScope', function($rootScope){
    // this is basically a global
    $rootScope.timeslots = ["9:00am", "9:40am", "10:40am", "11:20am"];
  }])
  // .directive(['game', function(){
  //   return {
  //     templateUrl: 'views/_game.html'
  //   };
  // }])
  .controller('TimelineController', ['$rootScope','$scope', 'games', function($rootScope, $scope, games){
    $scope.timeslots = $rootScope.timeslots;
    $scope.message = 'yo';
    $rootScope.header = 'WC8 Timeline';

    var g = games.data;
    
    $scope.games = g.reduce(function (mapped, item) {
      if (!mapped[item.timeslot]) {
        mapped[item.timeslot] = [];
      }

      mapped[item.timeslot].push(item);
      return mapped;
    }, []);
  }])
  .controller('TeamsController', ['$rootScope','$scope', 'teams', function($rootScope, $scope, teams){
    $scope.teams = teams.data;
    $rootScope.header = 'WC8 Teams';
  }]);