//Services here
(function () {
	angular.module('anguLearn.services', []).
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
		}
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
	}]);
})();
