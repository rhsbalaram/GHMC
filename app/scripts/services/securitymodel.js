'use strict';

/**
 * @ngdoc service
 * @name ghmcApp.securityModel
 * @description
 * # securityModel
 * Service in the ghmcApp.
 */
angular.module('ghmcApp')
  .service('securityModel',['Restangular','SecureStorage', '$rootScope', '$state','$http', '$q', function (Restangular,secureStorage, $rootScope, $state,$http, $q) {
  	 var model = this,
                    userDetails,
                    loggedInUserDetails,
                    loggedInUserDevice,
                    token,
                    LOGGED_USER_DETAILS = 'loggedUserDetails';
                    //   LOGGED_INUSER_DEVICE ='loggedInUserDevice',
                 //   EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
                model.isProfile = false;


                model.getLoggedInUserDetails = function() {
                    if (!loggedInUserDetails) {
                        loggedInUserDetails = secureStorage.get(LOGGED_USER_DETAILS);
                    }
                    return loggedInUserDetails;
                };

                model.getToken = function() {
                    //if (!token) {
                        token = secureStorage.get('access_token');
                    //}
                    return token;
                };

                model.logout = function() {
                    loggedInUserDetails = null;
                    secureStorage.remove(LOGGED_USER_DETAILS);
                    return Restangular.all('Users/logout').post();
                };

                model.isUserProductAdmin = function () {
                    var userDetails = JSON.parse(model.getLoggedInUserDetails());

                    var prodEntity = Restangular.all('products/' + userDetails.productId + '/administrators/rel/' + userDetails.id);
                    var deferred = $q.defer();

                    prodEntity.head()
                    .then(function(response) {
                        deferred.resolve({result:true});
                    }).catch(function(err) {
                        deferred.resolve({result:false});
                    });
                    return deferred.promise;
                };

                model.forgotPassword = function(email) {
                    var resetRequest = Restangular.all('Users/reset'),
                        deferred = $q.defer(),
                        postItem = {
                            email: email
                        };

                   /* if (EMAIL_REGEXP.test(email)) {
                        postItem = {
                            email: email
                        };
                    }*/

                    resetRequest.post(postItem)
                        .then(function(response) {
                            deferred.resolve(response);
                        })
                        .catch(function(response) {
                            var message;
                            switch (response.status) {
                                case 500:
                                    message = response.data.error.message || 'Error Encountered in Service';
                                    deferred.reject(message);
                                    break;
                                default:
                                    deferred.reject('Service Unreachable');
                                    break;
                            }
                        });
                    return deferred.promise;
                };

                 model.changePassword = function(userInfo) {
                    var deferred = $q.defer(),
                        postItem = {
                            currentpassword: userInfo.currentPassword,
                            newpassword: userInfo.password,
                            email: userInfo.email,
                            username: userInfo.username
                        },
                        userDetails = JSON.parse(model.getLoggedInUserDetails());

                        Restangular.all('users/' + userDetails.id + '/password').post(postItem)
                            .then(function(response) {
                                deferred.resolve(true);
                            }).catch(function() {
                                deferred.reject(false);
                            });

                        return deferred.promise;
                };

                model.authenticate = function(userEmail, password, phoneno) {
                    var tokenRequest = Restangular.all('Users/login'),
                        deferred = $q.defer(),
                        userEmail = userEmail,
                        password = password;
                    var postItem = {
                        'realm': 'smartcircle',
                        'email': userEmail,
                        'username': phoneno,
                        'password': password,
                        'uuid': phoneno
                    };

                  /*  if (EMAIL_REGEXP.test(userEmail)) {
                        postItem = {
                            'realm': 'smartcircle',
                            'email': userEmail,
                            'username': phoneno,
                            'password': password,
                            'uuid': phoneno
                        };
                    }*/

                    tokenRequest.post(postItem)
                        .then(function(response) {
                            var userRequest = Restangular.all('Users'),
                                userId,
                                data;

                            data = response.data || response;

                            secureStorage.set('access_token', data.id);//data.id

                            userId = data.userId; // Here we got  device and token and subscription and extraObject.
                          //  userId='58a6da1d05ea2b66a6cb800d'

                            userRequest.get(userId + '?filter[include]=enterprise')
                                .then(function(userResponse) {
                                	
                                    var user = userResponse.data || userResponse;
                                    var userDetails = {
                                            name: user.username,
                                            id: user.id,
                                            email: user.email,
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            enterpriseId: user.enterpriseId,
                                            enterprise: user.enterprise
                                        };
                                    
                                    userDetails.productId = $rootScope.productId; // setting productId and 
                                    userDetails.organizationId = userResponse.organizationId; // orhanization id in globally
                                    userDetails.device = response.device;
                                    console.log(JSON.stringify(userDetails));
                                    secureStorage.set(LOGGED_USER_DETAILS, JSON.stringify(userDetails));
                                    

                                    //Logout the user if he is REP
                                   /* model.isUserProductAdmin().then(function(response) {
                                        if(response.result === false) {
                                            if(! userDetails.enterprise || (userDetails.id != userDetails.enterprise.userId)) {
                                                model.logout();
                                                deferred.reject('Unauthorized');
                                                return deferred.promise;
                                            }
                                        }
                                        console.log("after is admin");

                                        if (userDetails.device.subscriptions === undefined) {
                                            // var userSubscription = Restangular.all('Devices');
                                            //userSubscription 
                                            var updateUserSubscription = subscriptionsUpdate().then(function(response) {
                                                console.log("User subscriptions added sucessfully");
                                            })

                                        }
                                        

                                        deferred.resolve(userDetails);
                                    });*/
                                    deferred.resolve(userDetails);
                                })
                                .catch(function() {
                                    deferred.reject('Unable to retrieve user information');
                                });
                        })
                        .catch(function(err) {
                            if (err.data !== null) {
                                deferred.reject(err);
                                $state.go('signin');
                            } else {
                                deferred.reject('Unable to Sign-In. Please retry.');
                                $state.go('signin');
                            }
                        });
                    return deferred.promise;
                };
                 function subscriptionsUpdate() {
                    var deferred = $q.defer();
                    var userDetails = JSON.parse(model.getLoggedInUserDetails());

                    var strJson = {
                        "subscriptions": ["EventMessage"]
                    }

                    var strsjs = JSON.stringify(strJson);

                    Restangular.all('Devices/' + userDetails.device.id)
                    .customPUT(strsjs).then(function(response) {

                        deferred.resolve(response);

                    }).catch(function(err) {

                        deferred.reject(err);

                    });
                    return deferred.promise;
                }

                model.getEvents=function(){
                var deferred = $q.defer(),
                       events=Restangular.all('enterprises'),
                        userDetails = JSON.parse(model.getLoggedInUserDetails());
console.log('enterprises/'+userDetails.enterpriseId+'/events');
                        events.get('58a6da1c05ea2b66a6cb800c'+'/events')//58a6da1c05ea2b66a6cb800c userDetails.enterpriseId
                            .then(function(response) {
                            	console.log('executed successfully');
                            	
                                deferred.resolve(response);
                            }).catch(function() {
                                deferred.reject(response);
                            });

                        return deferred.promise;	
                };

                ////////////
                 model.getDocuments=function(eventId){
                var deferred = $q.defer(),
                       events=Restangular.all('events'),
                        userDetails = JSON.parse(model.getLoggedInUserDetails());
console.log('events/'+eventId+'/documents');
                        events.get(eventId+'/documents')
                            .then(function(response) {
                                console.log('executed successfully documents');
                                
                                deferred.resolve(response);
                            }).catch(function() {
                                deferred.reject(response);
                            });

                        return deferred.promise;    
                };
		
		 ////////////
                 model.postEventDetails=function(event){
                var deferred = $q.defer();


              //  event.created = new Date(event.created);
              //   var accessToken = SecureStorage.get('access_token');

               //     var url = $rootScope.BaseUrl + '/events/' + event.id + '?access_token=' + accessToken;
                    var strObj1 = JSON.stringify(event);

                     var  events=Restangular.all('events/'+event.id);
                       // events=Restangular.one('events/'+event.id),
                        userDetails = JSON.parse(model.getLoggedInUserDetails());
console.log('events/'+event.id);
                        events.customPUT(strObj1)
                            .then(function(response) {
                                console.log('executed successfully update event');
                                console.log('resoponse update'+JSON.stringify(response));
                                
                                deferred.resolve(response);
                            }).catch(function() {
                                deferred.reject(response);
                            });

                        return deferred.promise;    
                };


                ////////////
                 model.postVolunteersPoints=function(joined_members,user){
                var deferred = $q.defer();


                     var  events=Restangular.all('products/'+$rootScope.productId+'/users/'+joined_members);

                     console.log('products/'+$rootScope.productId+'/users/'+joined_members);
                    
console.log('products/'+$rootScope.productId);
                        events.customPUT(user)
                            .then(function(response) {
                                console.log('executed successfully update event');
                                console.log('resoponse update'+JSON.stringify(response));
                                
                                deferred.resolve(response);
                            }).catch(function() {
                                deferred.reject(response);
                            });

                        return deferred.promise;    
                };


                /////////
                 model.getVolunteers=function(joined_members){
                var deferred = $q.defer();
              
                   var  events=Restangular.all('products');
                       // userDetails = JSON.parse(model.getLoggedInUserDetails());

                  console.log('products'+$rootScope.productId+'/users/'+joined_members);
                        events.get($rootScope.productId+'/users/'+joined_members)
                            .then(function(response) {
                               
                                
                               deferred.resolve(response);
                            }).catch(function() {
                                deferred.reject(response);
                            });
                
                
                     

                        return deferred.promise;    
                };
                /////////
 }]);
                

  