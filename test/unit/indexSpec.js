describe('Index', function(){

  beforeEach(module('ui.router'));
  beforeEach(module('anguLearn.index'));

  describe('Controller', function(){
		var indexCtrl, scope;

		beforeEach(inject(function($controller, $rootScope){
			scope = $rootScope.$new();
			indexCtrl = $controller('IndexController', {
				$scope: scope
			});
		}));

		it('should set "name" variable to "World!" value', function(){
			expect(scope.name).toBe("World!");
		});
	});
});
