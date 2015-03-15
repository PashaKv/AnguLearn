// *APP here* //
(function () {
	angular.module('anguLearn.app', ['ngRoute', 'anguLearn.app.controllers', 'anguLearn.app.services', 'anguLearn.app.directives'])
	.config(function ($routeProvider, $locationProvider) {
  		$routeProvider.
  		when('/', {
      		templateUrl: 'partials/index',
      		controller: 'IndexCtrl'
    	}).
    	when('/twitter', {
      		templateUrl: 'partials/twitter',
      		controller: 'TwitterCtrl'
    	}).
    	when('/youtube', {
      		templateUrl: 'partials/youtube',
      		controller: 'YoutubeCtrl'
    	}).
			when('/reddit', {
      		templateUrl: 'partials/reddit',
      		controller: 'RedditCtrl'
    	}).
    	otherwise({
      		redirectTo: '/'
    	});
    	$locationProvider.html5Mode(true);
	});
})();
