// *directives* //
(function(){
  angular.module('anguLearn.app.directives', []).
  directive('redditPost', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/reddit-post'
    };
  });
})();
