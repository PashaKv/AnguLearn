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

//Controllers here
(function () {

	angular.module('anguLearn.app.controllers', ['anguLearn.app.services']).
	controller('IndexCtrl', ['$scope', function($scope){
		$scope.name = 'World!';
	}]).
	controller('TwitterCtrl', ['$scope', 'twitterService', function($scope, twitterService){
		var twitter = {};
		$scope.twitter = twitter;
		twitter.tweets = {};
		twitter.myTweets = false;
		twitterService.init();

		$scope.deleteTweet = function(id){
			if(!twitter.myTweets){
				return false;
			}
			twitterService.deleteTweet(id).then(function(){
				$scope.getMyTweets();
			});
		};

		$scope.reTweet = function(id){
			if($scope.twitter.myTweets){
				return false;
			}
			twitterService.reTweet(id).then(function(){
				$scope.getMyTweets();
			});
		};

		$scope.getTweets = function(){
			twitterService.getAllTweets().then(function(data){
				twitter.myTweets = false;
				twitter.tweets = data;
				$scope.$apply();
			}, function(error){
				console.error(error);
			});
		};

		$scope.getMyTweets = function(){
			twitterService.getUserTweets().then(function(data){
				twitter.myTweets = true;
				twitter.tweets = data;
				$scope.$apply();
			}, function(error){
				console.error(error);
			});
		};

		$scope.logIn = function(){
			twitterService.connectTwitter().then(function(){
				if(twitterService.isReady()){
					$('#twitter-login').fadeOut();
					$('#twitter-getmytweets').fadeIn();
					$('#twitter-gettweets').fadeIn();
					$('#twitter-logout').fadeIn();
					$scope.getTweets();
				}
			});
		};

	  $scope.logOut = function() {
	  	twitterService.clearCache();
			twitter.tweets = {};
	    $('#twitter-login').fadeIn();
	    $('#twitter-getmytweets').fadeOut();
	    $('#twitter-gettweets').fadeOut();
	    $('#twitter-logout').fadeOut();
	  };

	  //if the user is a returning user, hide the sign in button and display the tweets
	  if (twitterService.isReady()) {
	  	$('#twitter-login').hide();
	    $('#twitter-getmytweets').show();
	    $('#twitter-gettweets').show();
	    $('#twitter-logout').show();
	    $scope.getTweets();
	  }
	}]).
	controller('YoutubeCtrl', ['$scope', 'youtubeService', function($scope, youtubeService){
		$scope.videos = {};
		$scope.me = false;
		$scope.theVideo = false;
		youtubeService.init();

		$scope.logIn = function(){
			youtubeService.connectYoutube().then(function(){
				if(youtubeService.isReady()){
					$('#youtube-login').fadeOut();
					$('#youtube-logout').fadeIn();
					$scope.initMe();
					$scope.getVideos();
				}
			});
		};

		$scope.logOut = function(){
			$scope.me = false;
			$scope.videos = false;
			$scope.closeVideo();
			youtubeService.clearCache();
			$('#youtube-login').fadeIn();
			$('#youtube-logout').fadeOut();
		};

		$scope.getVideos = function(){
			youtubeService.getPopularVideos().then(function(data){
				$scope.videos = data;
				$scope.$apply();
			}, function(error){
				console.error(error);
			});
		};

		$scope.initMe = function(){
			youtubeService.me().then(function(data){
				$scope.me = data;
			});
		};

		$scope.closeVideo = function(){
			$scope.theVideo = false;
			$('#videoFrame').html("");
		};

		$scope.showVideo = function(id){
			$scope.theVideo = true;
			$('#videoFrame').html("<iframe id=\"videoFrame\" width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/"+id+"\" frameborder=\"0\" allowfullscreen></iframe>");
		};

		if(youtubeService.isReady()){
			$('#youtube-login').hide();
			$('#youtube-logout').show();
			$scope.initMe();
			$scope.getVideos();
		}
	}])
	.controller('RedditCtrl', ['$scope', 'redditService', function($scope, redditService){
		redditService.init();

		$scope.login = function(){
			redditService.connectReddit();
		};

		var getMyInfo = function(){
			if(redditService.isReady()){
				redditService.me().then(function(data){
					data = data.data;
					$scope.name = data.name;
					$scope.created = data.created;
				}, function(error){
					console.log(error);
					$scope.error = error;
				});
			}
		};

		$scope.getHotLinks = function(){
			if(redditService.isReady()){
				redditService.hot().then(function(data){
					$scope.posts = data.data.data.children;
				}, function(error){
					console.log(error);
					$scope.error = error;
				});
			}
		};

		getMyInfo();
		$scope.getHotLinks();
	}])
	.controller('UIRouterCtrl', ['$scope', function($scope){
		//TODO: ui-route controller
	}]);

})();

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

// *FILTERS here* //

//Services here
(function () {
	angular.module('anguLearn.app.services', []).
	factory('twitterService', ['$q', function($q){
		var authResult = false;

		return {
			init: function(){
				OAuth.initialize('cIyA2CTYFnn3Y38En7gD228v2R0', {cache: true});
				authResult = OAuth.create('twitter');
			},
			isReady: function(){
				return authResult;
			},
			connectTwitter: function(){
				var deferred = $q.defer();
				OAuth.popup('twitter', {cache:true}, function(err, result){
					if(!err){
						authResult = result;
						deferred.resolve(true);
					}else{
						deferred.reject(err);
					}
				});
				return deferred.promise;
			},
			clearCache: function(){
				OAuth.clearCache('twitter');
				authResult = false;
			},
			getAllTweets: function(){
			  return authResult.get('/1.1/statuses/home_timeline.json');
			},
			getUserTweets: function(){
				return authResult.get('/1.1/statuses/user_timeline.json');
			},
			deleteTweet: function(id){
				return authResult.post('/1.1/statuses/destroy/'+id+'.json', {id: id, trim_user: true});
			},
			reTweet: function(id){
				return authResult.post('/1.1/statuses/retweet/'+id+'.json', {id: id, trim_user: true});
			}
		};
	}]).
	factory('youtubeService', ['$q', function($q){
		var authResult = false;

		return {
			init: function(){
				OAuth.initialize('cIyA2CTYFnn3Y38En7gD228v2R0', {cache: true});
				authResult = OAuth.create('youtube');
			},
			isReady: function(){
				return authResult;
			},
			connectYoutube: function(){
				var deferred = $q.defer();
				OAuth.popup('youtube', {cache:true}, function(err, result){
					if(!err){
						authResult = result;
						deferred.resolve(true);
					}else{
						deferred.reject(err);
					}
				});
				return deferred.promise;
			},
			clearCache: function(){
				OAuth.clearCache('youtube');
				authResult = false;
			},
			me: function(){
				return authResult.me();
			},
			getPopularVideos: function(){
				return authResult.get('/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10');
			}
		};
	}]).factory('redditService', ['$window', '$location', '$http', function($window, $location, $http){
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
	}]);
})();


(function () {
	angular.module('anguLearn', ['anguLearn.app']);
})();
