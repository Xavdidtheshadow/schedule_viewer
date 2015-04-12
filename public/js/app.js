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
      gen = function(endpoint, tail, query){
        return ['$http', '$stateParams', function($http, $stateParams){
            var id = '';
            var q = '';
            tail = typeof tail !== 'undefined' ? tail : '';
            if ($stateParams.id) {id += '/' + $stateParams.id;}
            if ($stateParams.pitch) {q = query + $stateParams.pitch;}
            console.log("in endpoint", endpoint);
            return $http.get(root + endpoint + id + tail + q);
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
          url: '/pitch/:pitch',
          templateUrl: 'views/pitch.html',
          controller: 'PitchController',
          resolve: {
            games: gen('games','','?pitch=')
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
          url: '/people',
          templateUrl: 'views/refs.html',
          controller: 'RefsController',
          resolve: {
            refs: gen('people')
          }
        })
        .state('ref', {
          url: '/people/:id',
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
        })
        .state('game', {
          url: '/game/:id',
          templateUrl: 'views/game.html',
          controller: 'GameController',
          resolve: {
            game: gen('games','?crews=1')
          }
        })
        .state('login', {
          url: '/login',
          templateUrl: 'views/login.html',
          controller: 'LoginController'
        })
        .state('clay', {
          url: '/clay',
          templateUrl: 'views/clay.html',
          controller: 'ClayController',
          resolve: {
            crews: gen('crews')
          }
        });

      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
  }])
  .run(['$rootScope', function($rootScope){
    // this is basically a global
    $rootScope.timeslots = [
      "(SAT) 9:00 AM", 
      "(SAT) 9:40 AM", 
      "(SAT) 10:40 AM", 
      "(SAT) 11:20 AM", 
      "(SAT) 12:20 PM", 
      "(SAT) 1:00 PM", 
      "(SAT) 2:00 PM",
      "(SAT) 2:40 PM", 
      "(SAT) 4:00 PM", 
      "(SAT) 4:40 PM", 
      "(SAT) 5:40 PM", 
      "(SAT) 6:20 PM", 
      "(SAT) 7:20 PM", 
      "(SAT) 8:00 PM", 
      "(SAT) 9:00 PM", 
      "(SAT) 9:40 PM",
      "(SUN) 9:00 AM", 
      "(SUN) 9:40 AM", 
      "(SUN) 10:40 AM", 
      "(SUN) 11:20 AM", 
      "(SUN) 1:00 PM", 
      "(SUN) 2:20 PM", 
      "(SUN) 3:40 PM", 
      "(SUN) 5:00 AM", 
      "(SUN) 5:40 AM", 
      "(SUN) 7:00 PM"
    ];

    // $rootScope.lastName = function(o) {
    //   return o.name.split(' ')[1];
    // };
  }])
  .directive('boxscore', function(){
    return {
      restrict: 'E',
      templateUrl: 'views/_boxscore.html',
      scope: {game: '='},
      controller: 'BoxscoreController'
    };
  })
  .factory('auth', ['$http', function($http){
    var o = {
      logged_in: false
    };

    o.login= function(creds){
      // don't read this
      if (creds === 'goblue') {
        o.logged_in = true;
      }
    };

    return o;
  }])
  .controller('BoxscoreController', ['$scope', function($scope){
    if ($scope.game.duration > 0){
      var minutes = Math.floor($scope.game.duration / 60);
      var seconds = $scope.game.duration - minutes * 60;
      $scope.game.duration = [minutes, seconds].join(':');
    }
  }])
  .controller('TimelineController', ['$rootScope','$scope', 'games', function($rootScope, $scope, games){
    $scope.timeslots = $rootScope.timeslots;
    $rootScope.header = 'WC8 Timeline';
    $scope.directions = ['Newest First', 'Oldest First'];
    $scope.d = 0;
    var g = games.data;
    
    $scope.games = g.reduce(function (mapped, item) {
      if (!mapped[item.timeslot]) {
        mapped[item.timeslot] = [];
      }

      mapped[item.timeslot].push(item);
      return mapped;
    }, []).reverse();

    $scope.flip = function(){
      $scope.games.reverse();
      if($scope.d === 0){$scope.d = 1;}
      else{$scope.d = 0;}
    };
  }])
  .controller('LoginController', ['$scope', '$state', 'auth', function($scope, $state, auth){
    $scope.go = function(){
      auth.login($scope.creds);
      if(auth.logged_in) {
        $state.go('timeline');
      }
    };
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
    $scope.vs = function(i){
      if ($scope.games[i].team_a._id === $scope.team._id) {
        return $scope.games[i].team_b.rank+'. '+$scope.games[i].team_b.name;
      }
      else {
        return $scope.games[i].team_a.rank+'. '+$scope.games[i].team_a.name;
      }
    };
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

    $scope.ar = function(i){
      if ($scope.ref._id === $scope.games[i].head_referee._id){return false;}
      var reffing = false;
      $scope.games[i].crews.forEach(function(c){
        if ($scope.ref.crews.indexOf(c) >= 0){reffing = true;}
      });
      return reffing;
    };
    $scope.playing = function(i){
      return [$scope.games[i].team_a._id, $scope.games[i].team_b._id].indexOf($scope.ref.team._id ) >= 0;
    };

    $scope.vs = function(i){
      if ($scope.games[i].team_a._id === $scope.ref.team._id) {
        return $scope.games[i].team_b.rank+'. '+$scope.games[i].team_b.name;
      }
      else {
        return $scope.games[i].team_a.rank+'. '+$scope.games[i].team_a.name;
      }
    };

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
  }])
  .controller('GameController', ['$rootScope','$scope', '$state', '$http', 'auth', 'game', function($rootScope, $scope, $state, $http, auth, game){
    if (auth.logged_in){$scope.message = 'in';}
    else {$scope.message = 'nope';}
    var g = game.data;
    $scope.auth = auth;
    $scope.refs = g.refs;
    $scope.game = g.game;
    if ($scope.game.duration > 0){
      var minutes = Math.floor($scope.game.duration / 60);
      var seconds = $scope.game.duration - minutes * 60;
      $scope.game.duration = [minutes, seconds].join(':');
    }

    $scope.make_hr = function(gid, hrid){
      // some sort of database call
      $http.post("https://quidapi.herokuapp.com/games/hr?api_key=qD8jnrWPc", {id: gid, hr: hrid}).then(function(){
        $state.reload();
      });

    };
    // $rootScope.header = $scope.ref.name + ' Schedule';
  }])
  .controller('ClayController', ['$rootScope','$scope', 'crews', function($rootScope, $scope, crews){
    $scope.crews = crews.data;
    $rootScope.header = 'WC8 Refs';
  }]);