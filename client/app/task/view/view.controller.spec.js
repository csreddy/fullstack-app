'use strict';

describe('Controller: viewTaskCtrl', function () {

  // load the controller's module
  beforeEach(module('task.controllers'));

  var TaskCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TaskCtrl = $controller('TaskCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
