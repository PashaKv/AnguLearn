//= include app/app.js
//= include app/**/*.js
(function () {
	angular.module('anguLearn',
		['ui.router',
			'anguLearn.index',
			'anguLearn.twitter',
			'anguLearn.youtube',
			'anguLearn.reddit',
			'anguLearn.uirouter'
		]
	)
	.config(function ($locationProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(true);
  });
})();
