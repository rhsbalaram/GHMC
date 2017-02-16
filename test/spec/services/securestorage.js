'use strict';

describe('Service: secureStorage', function () {

  // load the service's module
  beforeEach(module('ghmcApp'));

  // instantiate service
  var secureStorage;
  beforeEach(inject(function (_secureStorage_) {
    secureStorage = _secureStorage_;
  }));

  it('should do something', function () {
    expect(!!secureStorage).toBe(true);
  });

});
