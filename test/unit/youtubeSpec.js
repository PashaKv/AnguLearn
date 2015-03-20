describe('Youtube', function(){

  beforeEach(module('ui.router'));
  beforeEach(module('anguLearn.youtube'));

  describe('Controller', function(){
    var youtubeCtrl, scope, youtubeService, $q, $rootScope, $controller;
    beforeEach(inject(function(_$controller_, _youtubeService_, _$rootScope_, _$q_){
      $controller = _$controller_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      scope = _$rootScope_.$new();
      youtubeService = sinon.stub(_youtubeService_);
      youtubeCtrl = _$controller_('YoutubeController', {$scope:scope, youtubeService:youtubeService});
    }));

    it('should init itself with empty variables and try to initialize youtubeService', function(){
      expect(scope.videos).toEqualData({});
      expect(scope.me).toBeFalsy();
      expect(scope.theVideo).toBeFalsy();
      expect(youtubeService.init).toHaveBeenCalledOnce();
    });

    it('should try the autologin by isReady func result', function(){
      expect(youtubeService.isReady).toHaveBeenCalledOnce();
      expect(youtubeService.me).not.toHaveBeenCalled();
      youtubeService.isReady.returns(true);
      youtubeService.me.returns($q.when('me'));
      youtubeService.getPopularVideos.returns($q.when('vids'));
      sinon.stub(scope, '$apply');
      ctrl = $controller('YoutubeController', {$scope:scope});
      $rootScope.$digest();
      expect(scope.me).toBe('me');
      expect(scope.videos).toBe('vids');
    });

    it('should login via the service', function(){
      sinon.stub(scope, 'initMe');
      sinon.stub(scope, 'getVideos');
      youtubeService.connectYoutube.returns($q.when(true));
      youtubeService.isReady.returns(false);
      scope.logIn();
      $rootScope.$digest();
      expect(scope.initMe).not.toHaveBeenCalled();
      expect(scope.getVideos).not.toHaveBeenCalled();
      youtubeService.isReady.returns(true);
      youtubeService.connectYoutube.returns($q.when(true));
      scope.logIn();
      $rootScope.$digest();
      expect(scope.initMe).toHaveBeenCalledOnce();
      expect(scope.getVideos).toHaveBeenCalledOnce();
    });

    it('should clear scope variables after logout', function(){
      scope.me = 'Test_me';
      scope.videos = ['test', 'vids'];
      sinon.stub(scope, 'closeVideo');
      expect(scope.closeVideo).not.toHaveBeenCalled();
      expect(youtubeService.clearCache).not.toHaveBeenCalled();
      scope.logOut();
      expect(scope.me).toBeFalsy();
      expect(scope.videos).toBeFalsy();
      expect(scope.closeVideo).toHaveBeenCalledOnce();
      expect(youtubeService.clearCache).toHaveBeenCalledOnce();
    });

    it('output service error to console', function(){
      var defer = $q.defer();
      var errMsg = 'test error';
      youtubeService.getPopularVideos.returns(defer.promise);
      sinon.stub(console, 'error');
      scope.getVideos();
      defer.reject(errMsg);
      $rootScope.$digest();
      expect(console.error).toHaveBeenCalledWith(errMsg);
      console.error.restore();
    });

    it('should open and close the video with designated ID', function(){
      var testId = 'testID';
      expect(scope.theVideo).toBeFalsy();
      scope.showVideo(testId);
      expect(scope.theVideo).toBeTruthy();
      scope.closeVideo();
      expect(scope.theVideo).toBeFalsy();
    });
  });

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
