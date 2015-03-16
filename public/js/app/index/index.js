//Index page
(function(){
  angular.module('anguLearn.index', [])
  .config(function ($stateProvider) {
		$stateProvider
			.state('index', {
				url: "/",
				templateUrl: "partials/index",
				controller: "IndexController"
			});
  })
  .controller('IndexController', ['$scope', function($scope){
		$scope.name = 'World!';
	}]);
})();
