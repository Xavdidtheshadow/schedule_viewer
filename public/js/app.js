var app = angular.module('refViewer', ['ui.router'])
  .config([
    '$stateProvider', 
    '$urlRouterProvider', 
    '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider){
      // poor mans env variables
      var root = 'https://quidapi.herokuapp.com/';
      // var root = 'http://localhost:1337/';

      // generate an api call from endpoint
      // this got out of hand quickly
      gen = function(endpoint, tail){
        return ['$http', '$stateParams', function($http, $stateParams){
            var id = '';
            tail = typeof tail !== 'undefined' ? tail : '';
            if ($stateParams.id) {id += '/' + $stateParams.id;}
            if ($stateParams.query) {endpoint += $stateParams.query;}
            return $http.get(root + endpoint + id + tail);
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
        .state('pitch', {
          url: '/pitch/:query',
          templateUrl: 'views/pitch.html',
          controller: 'PitchController',
          resolve: {
            games: gen('games?pitch=')
          }
        })
        .state('teams', {
          url: '/teams',
          templateUrl: 'views/teams.html',
          controller: 'TeamsController',
          resolve: {
            teams: gen('teams')
          }
        })
        .state('team', {
          url: '/team/:id',
          templateUrl: 'views/team.html',
          controller: 'TeamController',
          resolve: {
            games: gen('teams', '/games')
          }
        })
        .state('refs', {
          url: '/refs',
          templateUrl: 'views/refs.html',
          controller: 'RefsController',
          resolve: {
            refs: gen('people')
          }
        })
        .state('ref', {
          url: '/ref/:id',
          templateUrl: 'views/ref.html',
          controller: 'RefController',
          resolve: {
            games: gen('people', '/games')
          }
        })
        .state('crew', {
          url: '/crew/:id',
          templateUrl: 'views/crew.html',
          controller: 'CrewController',
          resolve: {
            games: gen('crews', '/games'),
            refs: gen('crews')
          }
        });

      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
  }])
  .run(['$rootScope', function($rootScope){
    // this is basically a global
    $rootScope.timeslots = [
      "9:00 AM", 
      "9:40 AM", 
      "10:40 AM", 
      "11:20 AM", 
      "12:20 PM", 
      "1:00 PM", 
      "2:00 PM",
      "2:40 PM", 
      "4:00 PM", 
      "4:40 PM", 
      "5:40 PM", 
      "6:20 PM", 
      "7:20 PM", 
      "8:00 PM", 
      "9:00 PM", 
      "9:40 PM" 
    ];

    // $rootScope.lastName = function(o) {
    //   return o.name.split(' ')[1];
    // };
  }])
  .directive('boxscore', function(){
    return {
      restrict: 'E',
      templateUrl: 'views/_game.html',
      scope: {game: '='},
      controller: 'GameController'
    };
  })
  .controller('GameController', ['$scope', function($scope){
    if ($scope.game.duration > 0){
      var minutes = Math.floor($scope.game.duration / 60);
      var seconds = $scope.game.duration - minutes * 60;
      $scope.game.duration = [minutes, seconds].join(':');
    }
  }])
  .controller('TimelineController', ['$rootScope','$scope', 'games', function($rootScope, $scope, games){
    $scope.timeslots = $rootScope.timeslots;
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
  .controller('PitchController', ['$rootScope','$scope', 'games', function($rootScope, $scope, games){
    $scope.games = games.data;
    $rootScope.header = 'WC8 Teams';
  }])
  // well this is cute
  .controller('TeamsController', ['$rootScope','$scope', 'teams', function($rootScope, $scope, teams){
    $scope.teams = teams.data;
    $rootScope.header = 'WC8 Teams';
  }])
  .controller('TeamController', ['$rootScope','$scope', 'games', function($rootScope, $scope, games){
    var g = games.data;
    $scope.games = g.games;
    $scope.team = g.team;
    $rootScope.header = $scope.team.name + ' Schedule';
  }])
  .controller('RefsController', ['$rootScope','$scope', 'refs', function($rootScope, $scope, refs){
    $scope.refs = refs.data;
    $rootScope.header = 'WC8 Refs';
  }])
  .controller('RefController', ['$rootScope','$scope', 'games', function($rootScope, $scope, games){
    var g = games.data;
    $scope.ref = g.ref;
    $scope.games = g.games;
    $rootScope.header = $scope.ref.name + ' Schedule';
  }])
  .controller('CrewController', ['$rootScope','$scope', 'games', 'refs', function($rootScope, $scope, games, refs){
    var g = games.data;
    var r = refs.data;
    $scope.crew = g.crew;
    $scope.games = g.games;
    $scope.refs = r.people;
    if (angular.isArray($scope.crew)) {
      $scope.crew = $scope.crew.join('/');
    }
    $rootScope.header = $scope.crew + ' Schedule';
  }]);