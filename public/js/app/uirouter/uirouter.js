//Index page
(function(){
  angular.module('anguLearn.uirouter', [])
  .config(function ($stateProvider) {
		$stateProvider
      .state('uirouter', {
        url: "/uirouter",
        templateUrl: "partials/uirouter"
      })
      .state('uirouter.state1', {
        url: "/state1",
        templateUrl: "partials/uirouter/state1"
      })
        .state('uirouter.state1.list', {
          url: "/list",
          templateUrl: "partials/uirouter/state1/list",
          controller: function($scope) {
            $scope.items = ["A", "List", "Of", "Items"];
          }
        })
      .state('uirouter.state2', {
        url: "/state2",
        templateUrl: "partials/uirouter/state2"
      })
        .state('uirouter.state2.list', {
          url: "/list",
          templateUrl: "partials/uirouter/state2/list",
          controller: function($scope) {
            $scope.things = ["A", "Set", "Of", "Things"];
          }
        });
  });
})();
