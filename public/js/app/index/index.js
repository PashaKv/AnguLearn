//Index page
(function(){
  angular.module('anguLearn.index', [])
  .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");

		// Now set up the states
		$stateProvider
			.state('index', {
				url: "/",
				templateUrl: "partials/index",
				controller: "IndexController"
			});
      $locationProvider.html5Mode(true);
  })
  .controller('IndexController', ['$scope', function($scope){
		$scope.name = 'World!';
	}]);
})();
