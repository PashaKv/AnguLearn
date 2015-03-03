// *controllers here* //
(function () {
	
	angular.module('anguLearn.controllers', ['anguLearn.services']).
	controller('IndexCtrl', ['$scope', function($scope){
		$scope.name = 'World!';
	}]).
	controller('TwitterCtrl', ['$scope', '$q', 'twitterService', function($scope, $q, twitterService){
		$scope.tweets = {};
		$scope.myTweets = false;
		twitterService.init();

		$scope.deleteTweet = function(id){
			if(!$scope.myTweets){
				return;
			}
			twitterService.deleteTweet(id).then(function(){
				$scope.getMyTweets();
			});
		}

		$scope.reTweet = function(id){
			if($scope.myTweets){
				return;
			}
			twitterService.reTweet(id).then(function(){
				$scope.getMyTweets();
			});
		}

		$scope.getTweets = function(){
			twitterService.getAllTweets().then(function(data){
				$scope.myTweets = false;
				$scope.tweets = data;
			});
		};

		$scope.getMyTweets = function(){
			twitterService.getUserTweets().then(function(data){
				$scope.myTweets = true;
				$scope.tweets = data;
			});
		};

		$scope.logIn = function(){
			twitterService.connectTwitter().then(function(){
				if(twitterService.isReady()){
					$('#twitter-login').fadeOut();
					$('#twitter-logout').fadeIn();
					$scope.getTweets();
				}
			})
		};

	    $scope.logOut = function() {
	        twitterService.clearCache();
			$scope.tweets = {};
	        $('#twitter-login').fadeIn();
	        $('#twitter-logout').fadeOut();
	    };

	    //if the user is a returning user, hide the sign in button and display the tweets
	    if (twitterService.isReady()) {
	        $('#twitter-login').hide();
	        $('#twitter-logout').show();
	        $scope.getTweets();
	    };

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
		}

		$scope.showVideo = function(id){
			$scope.theVideo = true;
			$('#videoFrame').html("<iframe id=\"videoFrame\" width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/"+id+"\" frameborder=\"0\" allowfullscreen></iframe>");
		}

		if(youtubeService.isReady()){
			$('#youtube-login').hide();
			$('#youtube-logout').show();
			$scope.initMe();
			$scope.getVideos();
		};
	}]);

})();