describe('Youtube', function(){

  beforeEach(module('ui.router'));
  beforeEach(module('anguLearn.youtube'));

  describe('Service', function(){
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
  	});
  });
});
