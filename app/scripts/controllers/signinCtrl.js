'use strict';

/**
 * @ngdoc function
 * @name ghmcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ghmcApp
 */
angular.module('ghmcApp')
  .controller('signinCtrl', function (Restangular,securityModel, SecureStorage, $rootScope, $state,$scope) {
  // EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  
    
   $scope.login=function(){
    $scope.dataLoading=true;
   	var  userEmail=$scope.username;
     var userpassword=$scope.password;
     var phoneno=$scope.Phoneno;
   	securityModel.authenticate(userEmail, userpassword, phoneno).then(function(response) {
       $scope.dataLoading=false;
                           

                            $state.go('dashboard');
                        }).catch(function(err) {
                           console.log('error in login');
                            $scope.dataLoading=false;
                           $state.go('signin');
                           $scope.invalidLogin=true;

                        });

   }


  });
