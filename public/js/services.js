// *SERVICES here* //
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
						deferred.resolve();
					}else{
						console.error(err);
						deferred.reject();
					}
				});
				return deferred.promise;
			},
			clearCache: function(){
				OAuth.clearCache('twitter');
				authResult = false;
			},
			getAllTweets: function(){
				var deferred = $q.defer();
				var promise = authResult.get('/1.1/statuses/home_timeline.json').done(function(data){
					deferred.resolve(data);
				});
				return deferred.promise;
			},
			getUserTweets: function(){
				var deferred = $q.defer();
				var promise = authResult.get('/1.1/statuses/user_timeline.json').done(function(data){
					deferred.resolve(data);
				});
				return deferred.promise;
			},
			deleteTweet: function(id){
				var deferred = $q.defer();
				var promise = authResult.post('/1.1/statuses/destroy/'+id+'.json', {id: id, trim_user: true}).done(function(data){
					deferred.resolve(data);
				}).fail(function(jqxhr, textStatus, err){
					deferred.reject(err);
				});
				return deferred.promise;
			},
			reTweet: function(id){
				var deferred = $q.defer();
				var promise = authResult.post('/1.1/statuses/retweet/'+id+'.json', {id: id, trim_user: true}).done(function(data){
					deferred.resolve(data);
				}).fail(function(jqxhr, textStatus, err){
					deferred.reject(err);
				});
				return deferred.promise;
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
						deferred.resolve();
					}else{
						console.error(err);
						deferred.reject();
					}
				});
				return deferred.promise;
			},
			clearCache: function(){
				OAuth.clearCache('youtube');
				authResult = false;
			},
			me: function(){
				var deferred = $q.defer();
				authResult.me().done(function(data){
					deferred.resolve(data);
				});
				return deferred.promise;
			},
			getPopularVideos: function(){
				var deferred = $q.defer();
				var promise = authResult.get('/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10').done(function(data){
					deferred.resolve(data);
				}).fail(function(err){
					deferred.reject(err);
				});
				return deferred.promise;
			}
		};
	}]);
})();