// *controllers here* //
(function () {
	
	angular.module('anguLearn.controllers', ['anguLearn.services']).
	controller('IndexCtrl', ['$scope', '$q', 'twitterService', function($scope, $q, twitterService){
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
				$scope.myTweets = true;
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

	}]);

})();