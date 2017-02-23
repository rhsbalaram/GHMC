'use strict';

/**
 * @ngdoc function
 * @name ghmcApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the ghmcApp
 */
angular.module('ghmcApp')
  .controller('dashboardCtrl', function (SecureStorage,securityModel,$scope,$q,$rootScope) {
  	///////maps coding
    var markersMap=[];

  	
      var mapOptions = {
      	//center:myLatlng,
              zoom:10,
               
               mapTypeId:google.maps.MapTypeId.ROADMAP
            };
             var markerBounds = new google.maps.LatLngBounds();
            var infoWindow = new google.maps.InfoWindow();
           
            
				
            var map = new google.maps.Map(document.getElementById("map"),mapOptions);
            
                            markerBounds.extend(new google.maps.LatLng(17.387140,78.491684));
              //  map.fitBounds(markerBounds);
         /////maps coding
/////////table coding
  $scope.sortType     = 'created'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.searchFish   = ''; 
  $scope.members   = null;  
  $scope.Users=[];  // set the default search/filter term
  securityModel.getEvents().then(function(response) {
                           
console.log('Successfull of events call');
                         $scope.events=response||response.data; 

                         //console.log('------'+JSON.stringify(markersMap));

                         drawMarker();
                        // console.log('------'+JSON.stringify(markersMap));
                         showOnMap();
                         if(!$scope.selectedValue){

                         var firstEvent=$scope.events[0];
                         // $scope.members =$scope.events[0].extras.joined_members;
             $scope.selectedValue=  firstEvent.id;
           }
           getDocuments($scope.selectedValue);
           $scope.setSelected($scope.selectedValue);


                        }).catch(function(err) {
console.log('Failure in events call');
                       

                    });

      function getDocuments(eventId) {

    securityModel.getDocuments(eventId).then(function(response) {
        $scope.imagesDoc = [];
        for (var i = 0; i < response.length; i++) {
          var result=response[i];
            var imageDoc = {};
            var accessToken = SecureStorage.get('access_token');
            imageDoc.url = $rootScope.BaseUrl + '/documents/' + result.id + '/download?access_token=' + accessToken;
            $scope.imagesDoc.push(imageDoc);

        }
    }).catch(function(err) {
        console.log('Failure in getDocuments call');


    });


}

//////
 function getVolunteers(joined_members) {
  var listOfjoined=[];
  if(joined_members){
    listOfjoined=joined_members.split(',');
              }
              var UsersList=[];

                for(var i=0;i<listOfjoined.length;i++){

    securityModel.getVolunteers(listOfjoined[i]).then(function(response) {

       var user = response.data || response;
                                var newUser={};
                               newUser.name= user.firstName;
                               newUser.email=user.email;
                               newUser.in="10 am";
                               newUser.out="5 pm";
                               newUser.points="20";
                                UsersList.push(newUser);
       
        console.log(JSON.stringify(response));
    }).catch(function(err) {
        console.log('Failure in getVolunteers call');


    });
  }
   $scope.Users=UsersList;


}
//////








   $scope.selectedValue=null;
    $scope.setSelected = function(idSelectedVote) {
      for(var i=0;i<markersMap.length;i++)
      {
        var KV=markersMap[i];
        if(KV.id==idSelectedVote){
           KV.markerObj.set('animation', google.maps.Animation.BOUNCE);
    
        }
        else{
          KV.markerObj.set('animation', false);
        }
      }

 	
       $scope.selectedValue = idSelectedVote;
       getDocuments(idSelectedVote);
       console.log(idSelectedVote);
       var Events=$scope.events;
       for(var i=0;i<Events.length;i++){
        if(Events[i].id==idSelectedVote){
          Events[i].extras.joined_members

         getVolunteers(Events[i].extras.joined_members);
        }


       }

    }

    function drawMarker(){
       var eventsinMap = $scope.events;
      for(var i=0;i<eventsinMap.length;i++){
              //console.log(key, yourobject[key]);
   var eventMap=eventsinMap[i];
   
   if(eventMap.extras){
    console.log(JSON.stringify(eventMap));
      if(eventMap.extras.longitude){
        var KV={};
        KV.id=eventMap.id;
        var latlng = new google.maps.LatLng(eventMap.extras.latitude,eventMap.extras.longitude);
        KV.LatLang=latlng;
         var newmarker = new google.maps.Marker({
                  position: latlng,
                    title: "Address:"
               
                   });
         newmarker.set('Info',eventMap.name);
         
         
         KV.markerObj=newmarker;
         markersMap.push(KV);

      }
      else{
        console.log('inner inner if'+i);
      }
    }else{
      console.log('in inner else'+i);
    }


      }

    }

    function showOnMap(){
      for(var i=0;i<markersMap.length;i++)
      {
        
          var KV=markersMap[i];

      var newmarker= KV.markerObj;

       markerBounds.extend(KV.LatLang);
       map.fitBounds(markerBounds);
      newmarker.setMap(map);
       google.maps.event.addListener(newmarker, 'click', function () {
         var message=this.get("Info");       
              
              
               infoWindow.setContent(message);
         
         infoWindow.open(map, this);
           
       });
      
    }


    }

  
  // table coding 
 


  });
