//Services tested here
'use strict';

describe("Services", function(){

	beforeEach(function(){
		jasmine.addMatchers({
			toEqualData: function() {
				return {
					compare: function(actual, expected){
						return{
							pass: angular.equals(actual, expected)
						};
					}
				};
			}
		});
	});

	beforeEach(module('anguLearn'));
	beforeEach(module('anguLearn.services'));

	describe('twitterService', function(){
		var twitterService, deferred, $rootScope;

		beforeEach(inject(function(_twitterService_, $q, _$rootScope_){
			twitterService = _twitterService_;
			$rootScope = _$rootScope_;
			deferred = $q.defer();
		}));

		it("shoud store OAuth.create call result in the authResult variable and return it via isready method", function () {
				sinon.stub(OAuth, 'initialize');
				var crStub = sinon.stub(OAuth, 'create');
				crStub.onFirstCall().returns(false);
				crStub.onSecondCall().returns(true);
				expect(twitterService.isReady()).toBeFalsy();
				twitterService.init();
				expect(twitterService.isReady()).toBeFalsy();
				twitterService.init();
				expect(twitterService.isReady()).toBeTruthy();
				OAuth.initialize.restore();
				OAuth.create.restore();
		});

		it('should connect to twitter via OAuth.popup method and throw an error if it cant connect', function(){
			var spy = sinon.spy();
			expect(twitterService.isReady()).toBeFalsy();
			sinon.stub(OAuth, 'popup').callsArgWith(2, null, true);
			twitterService.connectTwitter().then(spy);
			$rootScope.$digest();
			expect(twitterService.isReady()).toBeTruthy();
			expect(spy).toHaveBeenCalledOnce();
			OAuth.popup.restore();
			spy = sinon.spy();
			sinon.stub(OAuth, 'popup').callsArgWith(2, true, null);
			twitterService.connectTwitter().then(null, spy);
			$rootScope.$digest();
			expect(twitterService.isReady()).toBeTruthy();
			expect(spy).toHaveBeenCalledOnce();
			OAuth.popup.restore();
		});


		it('should clear cache and set authResult to false', function(){
			var spy = sinon.spy(OAuth, 'clearCache');
			sinon.stub(OAuth, 'popup').callsArgWith(2, null, true);
			twitterService.connectTwitter();
			expect(twitterService.isReady()).toBeTruthy();
			expect(spy).not.toHaveBeenCalled();
			twitterService.clearCache();
			expect(spy).toHaveBeenCalledOnce();
			expect(twitterService.isReady()).toBeFalsy();
			OAuth.popup.restore();
			OAuth.clearCache.restore();
		});

		it('should make api calls to corresponding adresses', function(){
			var postStub = sinon.stub();
			postStub.onFirstCall().returnsArg(0);
			postStub.onSecondCall().returnsArg(0);
			sinon.stub(OAuth, 'create').returns({
				get:function(){
					return 'GET '+arguments[0];
				},
				post:postStub
			});
			twitterService.init();
			expect(twitterService.getAllTweets()).toBe('GET /1.1/statuses/home_timeline.json');
			expect(twitterService.getUserTweets()).toBe('GET /1.1/statuses/user_timeline.json');
			expect(twitterService.deleteTweet(100)).toBe('/1.1/statuses/destroy/100.json');
			expect(twitterService.reTweet(100)).toBe('/1.1/statuses/retweet/100.json');
			OAuth.create.restore();
		});
	});

	describe('youtubeService', function(){
		var youtubeService, deferred, $rootScope;

		beforeEach(inject(function(_youtubeService_, $q, _$rootScope_){
			youtubeService = _youtubeService_;
			$rootScope = _$rootScope_;
			deferred = $q.defer();
		}));

		it("shoud store OAuth.create call result in the authResult variable and return it via isready method", function () {
				sinon.stub(OAuth, 'initialize');
				var crStub = sinon.stub(OAuth, 'create');
				crStub.onFirstCall().returns(false);
				crStub.onSecondCall().returns(true);
				expect(youtubeService.isReady()).toBeFalsy();
				youtubeService.init();
				expect(youtubeService.isReady()).toBeFalsy();
				youtubeService.init();
				expect(youtubeService.isReady()).toBeTruthy();
				OAuth.initialize.restore();
				OAuth.create.restore();
		});

		it('should connect to youtube via OAuth.popup method', function(){
			var spy = sinon.spy();
			expect(youtubeService.isReady()).toBeFalsy();
			sinon.stub(OAuth, 'popup').callsArgWith(2, null, true);
			youtubeService.connectYoutube().then(spy);
			$rootScope.$digest();
			expect(youtubeService.isReady()).toBeTruthy();
			expect(spy).toHaveBeenCalledOnce();
			OAuth.popup.restore();
		});

		it('should throw an error if it cant connect to youtube', function(){
			var spy = sinon.spy();
			expect(youtubeService.isReady()).toBeFalsy();
			sinon.stub(OAuth, 'popup').callsArgWith(2, true, null);
			youtubeService.connectYoutube().then(null, spy);
			$rootScope.$digest();
			expect(youtubeService.isReady()).toBeFalsy();
			expect(spy).toHaveBeenCalled(true);
			OAuth.popup.restore();
		});

		it('should clear cache and set authResult to false', function(){
			var spy = sinon.spy(OAuth, 'clearCache');
			sinon.stub(OAuth, 'popup').callsArgWith(2, null, true);
			youtubeService.connectYoutube();
			expect(youtubeService.isReady()).toBeTruthy();
			expect(spy).not.toHaveBeenCalled();
			youtubeService.clearCache();
			expect(spy).toHaveBeenCalledOnce();
			expect(youtubeService.isReady()).toBeFalsy();
			OAuth.popup.restore();
			OAuth.clearCache.restore();
		});

		it('should make call to the "me" method if needed and make api calls to corresponding adresses', function(){
			sinon.stub(OAuth, 'create').returns({
				me:function(){
					return 'ME';
				},
				get:function(){
					return 'GET '+arguments[0];
				}
			});
			youtubeService.init();
			expect(youtubeService.me()).toBe('ME');
			expect(youtubeService.getPopularVideos()).toBe('GET /youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10');
			OAuth.create.restore();
		})
	});

	describe('redditService', function(){
		var redditService;

		beforeEach(inject(function(_redditService_){
			redditService = _redditService_;
		}));

		it('should define access_token during init if it is present as a hash parameter and clear it when asked to do so', function(){
			expect(redditService.isReady()).toBeFalsy();
			var $location;
			inject(function(_$location_){
				$location = _$location_;
			});
			sinon.stub($location, 'hash').returns('access_token=123');
			redditService.init();
			expect(redditService.isReady()).toBeTruthy();
			redditService.clearCache();
			expect(redditService.isReady()).toBeFalsy();
			$location.hash.restore();
		});
	});
});
