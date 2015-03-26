var app = angular.module('refViewer', ['ui.router'])
  .config([
    '$stateProvider', 
    '$urlRouterProvider', 
    '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider){
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'views/home.html',
          controller: 'MainController',
          resolve: {
            teams: ['$http', function($http){
              // return db.getTeams();
              return $http.get('http://quidapi.herokuapp.com/teams');
            }]
          }
        });

      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
  }])

  .controller('MainController', ['$scope', 'teams', function($scope, teams){
    $scope.message = 'yo';
    $scope.teams = teams.data;
  }]);