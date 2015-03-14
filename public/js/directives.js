// *directives* //
'use strict';
(function(){
  angular.module('anguLearn.directives', []).
  directive('redditPost', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/reddit-post'
    };
  });
})();
