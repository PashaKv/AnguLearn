//Controllers tested here

describe("Controllers", function(){

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

	beforeEach(module('anguLearn.app'));
	beforeEach(module('anguLearn.app.controllers'));

	describe('IndexCtrl', function(){
		var indexCtrl, scope;

		beforeEach(inject(function($controller, $rootScope){
			scope = $rootScope.$new();
			indexCtrl = $controller('IndexCtrl', {
				$scope: scope
			});
		}));

		it('should set "name" variable to "World!" value', function(){
			expect(scope.name).toBe("World!");
		});
	});

	describe('TwitterCtrl', function(){
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

			module('anguLearn.app', function($provide){
				$provide.value('twitterService', mockTwitterService);
			});

			inject(function(_$controller_, _twitterService_, _$q_, _$rootScope_){
				$controller = _$controller_;
				scope = _$rootScope_.$new();
				$q = _$q_;
				$rootScope = _$rootScope_;
				ctrl = $controller('TwitterCtrl', {$scope:scope});
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
});
