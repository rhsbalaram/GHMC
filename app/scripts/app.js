'use strict';

/**
 * @ngdoc overview
 * @name ghmcApp
 * @description
 * # ghmcApp
 *
 * Main module of the application.
 */
angular
  .module('ghmcApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'restangular'
  ])
  .config(function ($locationProvider,$stateProvider, $urlRouterProvider) {
$locationProvider.hashPrefix('');
     $urlRouterProvider.otherwise('/signin');
      $stateProvider
        .state('signin', {
              url: '/signin',
              templateUrl: 'views/signin.html' ,
              controller:'signinCtrl'
            
          
          
        })
         .state('dashboard', {
              url: '/dashboard',
              templateUrl: 'views/dashboard.html' ,
              controller:'dashboardCtrl',
              controllerAs:'vm'
          
          
        });
}).run(['Restangular', 'SecureStorage', '$rootScope', '$state',
      function (Restangular,  secureStorage, $rootScope, $state) {
        $rootScope.BaseUrl="http://52.34.54.113/api/v4";
         $rootScope.productId="9be21c89f580e6c63c47d14de93fbdba";
         $rootScope.productKey='OWJlMjFjODlmNTgwZTZjNjNjNDdkMTRkZTkzZmJkYmE6MDc1YWFiMTUwZGNiNDljNTIyYTAxNTM0YTQ2MmVlMjkyYWVjNjkwYg==';
        Restangular.setDefaultHeaders({
            'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        });
        Restangular.setBaseUrl("http://52.34.54.113/api/v4");

        var unsecurePages = {
          'kt.authenticate.signIn': true,
          'kt.authenticate.forgotPassword': true,
          'kt.authenticate.resetPassword': true,
          'kt.authenticate.signUp': true
        };

        Restangular.setFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {
          var accessToken = secureStorage.get('access_token');
          var productKey = 'OWJlMjFjODlmNTgwZTZjNjNjNDdkMTRkZTkzZmJkYmE6MDc1YWFiMTUwZGNiNDljNTIyYTAxNTM0YTQ2MmVlMjkyYWVjNjkwYg==';

          if (accessToken) {
            angular.extend(params, {
              'access_token': accessToken
            });
          }
          if (productKey) {
            angular.extend(headers, {
              'X-Product-Key': productKey
            });
          }

          return {
            'element': element,
            'params': params,
            'headers': headers,
            'httpConfig': httpConfig
          };
        });
          
        Restangular.setErrorInterceptor(
          function ( response, deferred, responseHandler ) {
              if ( response.status == 401) {
                  deferred.reject("unauthorized");
                  $state.go('signin');
                  // Stop the promise chain here
                  // all unauthorized access are handled the same.
                  return false;
              }
              
              // DON'T stop promise chain since error is not handled
              return true;
          }
        );

        $rootScope.$on('$stateChangeStart', function (event, toState) {

          if (unsecurePages[toState.name] === true) {
            if( toState.name === "signin" && secureStorage.get('access_token')) {
                $state.go('dashboard');
            } else {
                return; // no need to redirect
            }
          }

          // now, redirect only not authenticated
         
        });

      }]);
   
 
