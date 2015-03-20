describe('UI-Router', function(){

  beforeEach(module('ui.router'));
  beforeEach(module('anguLearn.uirouter'));
  beforeEach(module('anguLearn.templates'));

  describe('Controllers', function(){
    var $controller, $rootScope, $state;

      beforeEach(inject(
        function( _$controller_, _$rootScope_, _$state_) {
          $controller = _$controller_;
          $rootScope = _$rootScope_;
          $state = _$state_;
        })
      );

      it('should populate items array at state1.list', function() {
        var scope = $rootScope.$new();
        $state.go('uirouter.state1.list');
        $rootScope.$digest();
        $state.current.controller(scope);
        expect(scope.items).toEqualData(["A", "List", "Of", "Items"]);
      });

      it('should populate things array at state2.list', function() {
        var scope = $rootScope.$new();
        $state.go('uirouter.state2.list');
        $rootScope.$digest();
        $state.current.controller(scope);
        expect(scope.things).toEqualData(["A", "Set", "Of", "Things"]);
      });

  });

});
