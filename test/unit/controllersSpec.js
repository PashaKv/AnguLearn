//Controllers tested here
'use strict';

describe("AnguLearn Controllers", function(){

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
		var twitterCtrl, scope;

		beforeEach(inject(function($controller, $rootScope){
			scope = $rootScope.$new();
			twitterCtrl = $controller('TwitterCtrl', {
				$scope: scope
			});
		}));

		it('should initialise tweets with an empty object', function(){
			expect(scope.tweets).toEqualData({});
		});

		it('should set "myTweets" variable to be false', function(){
			expect(scope.myTweets).toBe(false);
		});

	});
});