//Controllers here
'use strict';

(function () {

	angular.module('anguLearn.controllers', ['anguLearn.services']).
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
	}]);

})();
