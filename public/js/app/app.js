// *APP here* //
(function () {
	angular.module('anguLearn.app', ['ui.router', 'anguLearn.app.controllers', 'anguLearn.app.services', 'anguLearn.app.directives'])
	.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");

		// Now set up the states
		$stateProvider
			.state('index', {
				url: "/",
				templateUrl: "partials/index",
				controller: "IndexCtrl"
			})
			.state('twitter', {
				url: "/twitter",
				templateUrl: "partials/twitter",
				controller: "TwitterCtrl"
			})
			.state('youtube', {
				url: "/youtube",
				templateUrl: "partials/youtube",
				controller: "YoutubeCtrl"
			})
			.state('reddit', {
				url: "/reddit",
				templateUrl: "partials/reddit",
				controller: "RedditCtrl"
			})
			.state('ui-router', {
				url: "/ui-router",
				templateUrl: "partials/ui-router"
			})
			.state('ui-router.state1', {
				url: "/state1",
				templateUrl: "partials/ui-router/state1"
			})
				.state('ui-router.state1.list', {
					url: "/list",
					templateUrl: "partials/ui-router/state1/list",
					controller: function($scope) {
						$scope.items = ["A", "List", "Of", "Items"];
					}
				})
			.state('ui-router.state2', {
				url: "/state2",
				templateUrl: "partials/ui-router/state2"
			})
				.state('ui-router.state2.list', {
					url: "/list",
					templateUrl: "partials/ui-router/state2/list",
					controller: function($scope) {
						$scope.things = ["A", "Set", "Of", "Things"];
					}
				});

    	$locationProvider.html5Mode(true);
	});
})();
