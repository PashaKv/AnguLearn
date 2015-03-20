describe('Reddit', function(){

  beforeEach(module('ui.router'));
  beforeEach(module('anguLearn.reddit'));
  beforeEach(module('anguLearn.templates'));

  describe('Controller', function(){
    var redditCtrl, scope, redditService, $q, $rootScope;
    beforeEach(inject(function(_$controller_, _redditService_, _$rootScope_, _$q_){
      $q = _$q_;
      $rootScope = _$rootScope_;
      scope = _$rootScope_.$new();
      redditService = sinon.stub(_redditService_);
      redditCtrl = _$controller_('RedditController', {$scope:scope, redditService:redditService});
    }));

    it('should initialize the service on creation', function(){
      expect(redditService.init).toHaveBeenCalledOnce();
    });

    it('should try to get user info and on creation', function(){
      expect(redditService.isReady).toHaveBeenCalledTwice();
    });


    it('should create logIn function that connects to reddit', function(){
      expect(scope.logIn).toBeDefined();
      expect(redditService.connectReddit).not.toHaveBeenCalled();
      scope.logIn();
      expect(redditService.connectReddit).toHaveBeenCalledOnce();
    });

    it('shouldn\'t try to get any info if redditService isn\'t ready', function(){
      var initialCount = redditService.isReady.callCount;
      redditCtrl.getMyInfo();
      expect(redditService.isReady.callCount).toBe(initialCount+1);
      expect(redditService.me).not.toHaveBeenCalled();
      scope.getHotLinks();
      expect(redditService.isReady.callCount).toBe(initialCount+2);
      expect(redditService.hot).not.toHaveBeenCalled();
    });

    it('should get user info if redditService is ready and provide error if request fails', function(){
      redditService.isReady.returns(true);
      var deferred = $q.defer();
      var sampleData = {
                          data:{
                            name: 'test',
                            created: 'test2'
                          }
                        };
      redditService.me.returns(deferred.promise);
      redditCtrl.getMyInfo();
      deferred.resolve(sampleData);
      $rootScope.$digest();
      expect(scope.name).toBe('test');
      expect(scope.created).toBe('test2');
      deferred = $q.defer();
      redditService.me.returns(deferred.promise);
      redditCtrl.getMyInfo();
      deferred.reject('TEST ERROR');
      $rootScope.$digest();
      expect(scope.error).toBe('TEST ERROR');
    });

    it('should get hot links redditService is ready and provide error if request fails', function(){
      redditService.isReady.returns(true);
      var deferred = $q.defer();
      var sampleData = {
                          data:{
                            data:{
                              children: ['1', '2', '3']
                            }
                          }
                        };
      redditService.hot.returns(deferred.promise);
      scope.getHotLinks();
      deferred.resolve(sampleData);
      $rootScope.$digest();
      expect(scope.posts).toEqualData(['1', '2', '3']);
      deferred = $q.defer();
      redditService.hot.returns(deferred.promise);
      scope.getHotLinks();
      deferred.reject('TEST ERROR');
      $rootScope.$digest();
      expect(scope.error).toBe('TEST ERROR');
    });
  });

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
