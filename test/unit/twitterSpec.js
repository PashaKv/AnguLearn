describe('Twitter', function(){

  beforeEach(module('ui.router'));
  beforeEach(module('anguLearn.twitter'));

  describe('Controller', function(){
  	var ctrl, scope, mockTwitterService, $controller, $q, $rootScope;

  	beforeEach(function () {
  		mockTwitterService = sinon.stub({
  			init: function(){},
  			isReady: function(){},
  			connectTwitter: function(){},
  			clearCache: function(){},
  			getAllTweets: function(){},
  			getUserTweets: function(){},
  			deleteTweet: function(id){},
  		  reTweet: function(id){}
  		});

  		module('anguLearn.twitter', function($provide){
  			$provide.value('twitterService', mockTwitterService);
  		});

  		inject(function(_$controller_, _twitterService_, _$q_, _$rootScope_){
  			$controller = _$controller_;
  			scope = _$rootScope_.$new();
  			$q = _$q_;
  			$rootScope = _$rootScope_;
  			ctrl = $controller('TwitterController', {$scope:scope});
  			scope.on = ctrl;
  		});
  	});

  	it('should initialise tweets with an empty object', function(){
  		expect(scope.twitter.tweets).toEqualData({});
  	});

  	it('should set "myTweets" variable to be false by default', function(){
  		expect(scope.twitter.myTweets).toBe(false);
  	});

  	it('shouldnt delete non-users tweets, after deleting should get users tweets', function(){
  		expect(scope.deleteTweet(1)).toBeFalsy();
  		scope.twitter.myTweets = true;
  		var stub = sinon.stub(scope, 'getMyTweets');
  		expect(mockTwitterService.deleteTweet).not.toHaveBeenCalled();
  		expect(stub).not.toHaveBeenCalled();
  		mockTwitterService.deleteTweet.returns($q.when(1));
  		scope.deleteTweet(1);
  		$rootScope.$digest();
  		expect(mockTwitterService.deleteTweet).toHaveBeenCalledWith(1);
  		expect(stub).toHaveBeenCalledOnce();
  		stub.restore();
  	});

  	it('should retweet only non-users tweets, after retweeting should get users tweets', function(){
  		scope.twitter.myTweets = true;
  		expect(scope.reTweet(1)).toBeFalsy();
  		scope.twitter.myTweets = false;
  		mockTwitterService.reTweet.returns($q.when(1));
  		var stub = sinon.stub(scope, 'getMyTweets');
  		expect(mockTwitterService.reTweet).not.toHaveBeenCalled();
  		expect(stub).not.toHaveBeenCalled();
  		scope.reTweet(1);
  		$rootScope.$digest();
  		expect(mockTwitterService.reTweet).toHaveBeenCalledWith(1);
  		expect(stub).toHaveBeenCalledOnce();
  		stub.restore();
  	});

  	it('should get tweets and manage scope vars accordingly', function(){
  		scope.twitter.myTweets = true;
  		var sampleData = {'test1': 'testdata1', 'test2': 'testdata2'};
  		mockTwitterService.getAllTweets.returns($q.when(sampleData));
  		var stub = sinon.stub(scope, '$apply');
  		expect(stub).not.toHaveBeenCalled();
  		scope.getTweets();
  		$rootScope.$digest();
  		expect(stub).toHaveBeenCalledOnce();
  		expect(scope.twitter.myTweets).toBeFalsy();
  		expect(scope.twitter.tweets).toEqualData(sampleData);

  		scope.myTweets = true;
  		sampleData.test3 = 'testdata3';
  		scope.tweets = sampleData;
  		stub.restore();
  		var defer = $q.defer();
  		stub = sinon.stub(console, 'error');
  		mockTwitterService.getAllTweets.returns(defer.promise);
  		defer.reject('test err');
  		scope.getTweets();
  		$rootScope.$digest();
  		expect(scope.myTweets).toBeTruthy();
  		expect(scope.tweets).toEqualData(sampleData);
  		expect(stub).toHaveBeenCalledWith('test err');
  		stub.restore();
  	});

  	it('should get the user tweets and manage variables accordingly', function () {
  		scope.twitter.myTweets = false;
  		var sampleData = {'test1': 'testdata1', 'test2': 'testdata2'};
  		mockTwitterService.getUserTweets.returns($q.when(sampleData));
  		var stub = sinon.stub(scope, '$apply');
  		expect(stub).not.toHaveBeenCalled();
  		scope.getMyTweets();
  		$rootScope.$digest();
  		expect(stub).toHaveBeenCalledOnce();
  		expect(scope.twitter.myTweets).toBeTruthy();
  		expect(scope.twitter.tweets).toEqualData(sampleData);

  		scope.twitter.myTweets = false;
  		sampleData.test3 = 'testdata3';
  		scope.twitter.tweets = sampleData;
  		stub.restore();
  		var defer = $q.defer();
  		stub = sinon.stub(console, 'error');
  		mockTwitterService.getUserTweets.returns(defer.promise);
  		defer.reject('test err');
  		scope.getMyTweets();
  		$rootScope.$digest();
  		expect(scope.twitter.myTweets).toBeFalsy();
  		expect(scope.twitter.tweets).toEqualData(sampleData);
  		expect(stub).toHaveBeenCalledWith('test err');
  		stub.restore();
  	});

  	it('should login using twitterService', function(){
  		mockTwitterService.connectTwitter.returns($q.when(1));
  		expect(mockTwitterService.connectTwitter).not.toHaveBeenCalled();
  		expect(mockTwitterService.isReady).toHaveBeenCalledOnce();
  		scope.logIn();
  		expect(mockTwitterService.connectTwitter).toHaveBeenCalledOnce();
  		$rootScope.$digest();
  		expect(mockTwitterService.isReady).toHaveBeenCalledTwice();
  	});

		it('should test the logout', function(){
			var sampleData = {'test1': 'testdata1', 'test2': 'testdata2'};
			scope.twitter.tweets = sampleData;
			expect(scope.twitter.tweets).toEqualData(sampleData);
			expect(mockTwitterService.clearCache).not.toHaveBeenCalled();
			scope.logOut();
			expect(scope.twitter.tweets).toEqualData({});
			expect(mockTwitterService.clearCache).toHaveBeenCalledOnce();
		});

		it('should test the autologin by isReady func result', function(){
			expect(mockTwitterService.isReady).toHaveBeenCalledOnce();
		});
	});

  describe('Service', function(){
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
});
