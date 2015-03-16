//Twitter page
(function(){
  angular.module('anguLearn.twitter', [])
  .config(function ($stateProvider) {
		$stateProvider
      .state('twitter', {
        url: "/twitter",
        templateUrl: "partials/twitter",
        controller: "TwitterController"
      });
  })
  .controller('TwitterController', ['$scope', 'twitterService', function($scope, twitterService){
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
	}])
  .factory('twitterService', ['$q', function($q){
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
	}]);  
})();
