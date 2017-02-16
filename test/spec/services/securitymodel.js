'use strict';

describe('Service: securityModel', function () {

  // load the service's module
  beforeEach(module('ghmcApp'));

  // instantiate service
  var securityModel;
  beforeEach(inject(function (_securityModel_) {
    securityModel = _securityModel_;
  }));

  it('should do something', function () {
    expect(!!securityModel).toBe(true);
  });

});
