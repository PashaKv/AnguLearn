describe('Reddit', function(){

  beforeEach(module('ui.router'));
  beforeEach(module('anguLearn.reddit'));
  beforeEach(module('anguLearn.templates'));
  
	describe('Service', function(){
		var redditService, $window, $http;

		beforeEach(function(){
			module(function($provide) {
				$window = {
					location:{
						replace: sinon.stub()
					},
					sessionStorage: []
				};
				$provide.value('$window', $window);
			});
		});

		beforeEach(inject(function(_redditService_, _$http_){
			redditService = _redditService_;
			$http = _$http_;
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

		it('should connect to reddit', function(){
			expect($window.location.replace).not.toHaveBeenCalled();
			redditService.connectReddit();
			expect($window.location.replace).toHaveBeenCalledOnce();
		});

		it('shoud request user info from reddit', function(){
			var stub = sinon.stub($http, 'get');
			expect(stub).not.toHaveBeenCalled();
			redditService.me();
			expect(stub).toHaveBeenCalledOnce();
			stub.restore();
		});

		it('shoud request hot posts from reddit', function(){
			var stub = sinon.stub($http, 'get');
			expect(stub).not.toHaveBeenCalled();
			redditService.hot();
			expect(stub).toHaveBeenCalledOnce();
			stub.restore();
		});
	});

  describe('Post directive', function(){
    var $compile, $rootScope;

    beforeEach(inject(function(_$compile_, _$rootScope_){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('replaces the element with the appropriate content', function() {
      var element = $compile("<reddit-post></reddit-post>")($rootScope);
      $rootScope.$digest();
      expect(element.html()).not.toBe('');
    });
  });
});
