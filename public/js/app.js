// *APP here* //
(function () {
	var app = angular.module('anguLearn', ['ngRoute', 'anguLearn.controllers', 'anguLearn.services']);

	app.config(function ($routeProvider, $locationProvider) {
  		$routeProvider.
  		when('/', {
      		templateUrl: 'partials/index',
      		controller: 'IndexCtrl'B
    	}).
    	when('/twitter', {
      		templateUrl: 'partials/twitter',
      		controller: 'TwitterCtrl'
    	}).
    	when('/youtube', {
      		templateUrl: 'partials/youtube',
      		controller: 'YoutubeCtrl'
    	}).
    	otherwise({
      		redirectTo: '/'
    	});
    	$locationProvider.html5Mode(true);
	});
И
})();
