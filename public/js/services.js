//Services here
'use strict';
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
