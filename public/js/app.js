// *APP here* //
(function () {
	var app = angular.module('anguLearn', ['ngRoute', 'anguLearn.controllers', 'anguLearn.services']);

	app.config(function ($routeProvider) {
  		$routeProvider.
    	when('/', {
      		templateUrl: 'partials/index',
      		controller: 'IndexCtrl'
    	}).
    	otherwise({
      		redirectTo: '/'
    	});
	});

})();