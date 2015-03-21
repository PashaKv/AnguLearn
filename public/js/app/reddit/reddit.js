//Index page
(function(){
  angular.module('anguLearn.reddit', [])
  .config(function ($stateProvider) {
		$stateProvider
      .state('reddit', {
				url: "/reddit",
				templateUrl: "partials/reddit",
				controller: "RedditController"
			});
  })
  .controller('RedditController', ['$scope', 'redditService', function($scope, redditService){
		redditService.init();

		$scope.logIn = function(){
			redditService.connectReddit();
		};

		this.getMyInfo = function(){
			if(redditService.isReady()){
				redditService.me().then(function(data){
					data = data.data;
					$scope.name = data.name;
					$scope.created = data.created;
				}, function(error){
					// console.log(error);
          //TODO: proper error handling
					$scope.error = error;
				});
			}
		};

		$scope.getHotLinks = function(){
			if(redditService.isReady()){
				redditService.hot().then(function(data){
					$scope.posts = data.data.data.children;
				}, function(error){
					// console.log(error);
          //TODO: proper error handling
					$scope.error = error;
				});
			}
		};

		this.getMyInfo();
		$scope.getHotLinks();
	}])
  .factory('redditService', ['$window', '$location', '$http', function($window, $location, $http){
		var redirect_uri = 'http://localhost:3000/reddit';
		var client_id = 'OpVJdT3rse-m9w';
		var reddit_scope = 'identity,read';
		var redditLink;
		var params = {};
		var state = '';

		function generateState() {
			function s4() {
    		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  		}
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    	s4() + '-' + s4() + s4() + s4();
		}

		function saveState(newState){
			$window.sessionStorage.angulearn_state = newState.toString();
		}

		return {
			init: function(){
				state = $window.sessionStorage.angulearn_state || generateState();
				if(!$window.sessionStorage.angulearn_state){
					saveState(state);
				}
				redditLink = "https://ssl.reddit.com/api/v1/authorize?client_id="+client_id+"&response_type=token&state="+state+"&redirect_uri="+redirect_uri+"&scope="+reddit_scope;

				$location.hash().split('&').forEach(function (param) {
					param = param.split('=');
					params[param[0]] = param[1];
				});
			},
			isReady: function(){
				if(params.access_token){
					return true;
				}else{
					return false;
				}
			},
			connectReddit: function(){
				$window.location.replace(redditLink);
			},
			clearCache: function(){
				params = {};
				$window.sessionStorage.angulearn_state = '';
			},
			me: function(){
				return $http.get('https://oauth.reddit.com/api/v1/me', {headers:{'Authorization':'bearer '+params.access_token}});
			},
			hot: function(){
				return $http.get('https://oauth.reddit.com/hot', {headers:{'Authorization':'bearer '+params.access_token}});
			}
		};
	}])
  .directive('redditPost', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/reddit/post'
    };
  });
})();
