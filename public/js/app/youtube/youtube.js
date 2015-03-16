//Youtube page
(function(){
  angular.module('anguLearn.youtube', [])
  .config(function ($stateProvider) {
		$stateProvider
      .state('youtube', {
        url: "/youtube",
        templateUrl: "partials/youtube",
        controller: "YoutubeController"
      });
  })
  .controller('YoutubeController', ['$scope', 'youtubeService', function($scope, youtubeService){
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
  .factory('youtubeService', ['$q', function($q){
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
