'use strict';

/**
 * @ngdoc service
 * @name ghmcApp.secureStorage
 * @description
 * # secureStorage
 * Factory in the ghmcApp.
 */
angular.module('ghmcApp')
  .factory('SecureStorage', function () {
    // Service logic
    // ...
  var self = this;

            self.set = function (key, value) {
                sessionStorage.setItem(key, value);
            };

            self.get = function (key) {
                var sessionValue = sessionStorage.getItem(key),
                    value;
                return sessionValue;
            };

            self.remove = function (key) {
                return sessionStorage.removeItem(key);
            };

            self.clearAll = function () {
                return sessionStorage.clear();
            };
            return self;
    
      
    
  });
