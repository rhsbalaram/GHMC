'use strict';

/**
 * @ngdoc function
 * @name ghmcApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the ghmcApp
 */
angular.module('ghmcApp')
  .controller('dashboardCtrl', function (securityModel,$scope) {
  	///////maps coding
  	 var myLatlng = new google.maps.LatLng(51.508742,-0.120850);
      var mapOptions = {
      	center:myLatlng,
              zoom:15,
               
               mapTypeId:google.maps.MapTypeId.ROADMAP
            };
             var markerBounds = new google.maps.LatLngBounds();
            var infoWindow = new google.maps.InfoWindow({
            	   content: "<b>Address:</b><br>Bapu Nagar,<br>Sr.nagar,<br>Hyd-500038.",
            	   //title:"Address:"
            });
           
            var marker = new google.maps.Marker({
                  position: myLatlng,
                    title: "Address:"

                 
                   });

				
            var map = new google.maps.Map(document.getElementById("map"),mapOptions);
            marker.setMap(map);
             marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });
               // markerBounds.extend(myLatlng);
              //  map.fitBounds(markerBounds);
         /////maps coding
/////////table coding
  $scope.sortType     = 'created'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.searchFish   = '';     // set the default search/filter term
  securityModel.getEvents().then(function(response) {
                           
console.log('Successfull of events call');
                         $scope.events=response||response.data; 
                        }).catch(function(err) {
console.log('Failure in events call');
                       

                    });
$scope.selectedValue=null;
 $scope.setSelected = function(idSelectedVote) {
       $scope.selectedValue = idSelectedVote;
       console.log(idSelectedVote);
    }

  
  // table coding 
 


  });
