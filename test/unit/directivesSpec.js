//Directives tested here
describe('Directives', function() {
  describe('Reddit post directive', function(){
    var $compile, $rootScope;

    beforeEach(module('anguLearn.app.directives'));
    beforeEach(module('anguLearn.templates'));

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
