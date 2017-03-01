'use strict';

/**
 * @ngdoc function
 * @name ghmcApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the ghmcApp
 */
angular.module('ghmcApp')
.factory('Chart', function () {
    var chartConfig = {
        chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },

        plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
    },
        series: [{
            data: [/*{
                        name: "Environment",
                        y: 10
                    }, {
                        name: "Clean City",
                        y: 20
                    }, {
                        name: "Human Rights",
                        y: 30
                    }, {
                        name: "Politics",
                        y: 40
                    }*/]
               
        }],
        
        title: {
            text: 'Events Problem Wise'
        },

        loading: false
        
    }
    return chartConfig;
})
          
  .controller('dashboardCtrl', function (SecureStorage,securityModel,$scope,$q,$rootScope,Chart) {

     $scope.chartConfig = Chart;
  
   /* $scope.update = function () {

                         $scope.chartConfig.series = [{
                          "data": [envCount, cleanCount, hrCount, polCount]
                        }];
        console.log($scope.chartConfig.series);
        console.log($scope.chartConfig);
    }
*/

                         
securityModel.getEvents().then(function(response) {

                         var envCount=0;
                         var cleanCount=0;
                         var hrCount=0;
                         var polCount=0;


                         $scope.events=response||response.data; 

                         var Events = $scope.events;
                        
                         for(var i=0;i<Events.length;i++){

                          if(Events[i].extras.grievance_type=="Environment"){
                            envCount++;
                          }
                          else if(Events[i].extras.grievance_type=="Clean City"){
                            cleanCount++;
                          }
                          else if(Events[i].extras.grievance_type=="Human Rights"){
                            hrCount++;
                          }
                          else if(Events[i].extras.grievance_type=="Politics"){
                            polCount++;
                          }

                         }
$scope.chartConfig.series = [{

                    data: [{
                          "name": "Environment",
                          "y": envCount
                        },
                        {
                          "name": "Clean City",
                          "y": cleanCount
                        },
                        {
                          "name": "Human Rights",
                          "y": hrCount
                        },
                        {
                          "name": "Politics",
                          "y": polCount
                        }

                        ]
                        }];

                       
                        }).catch(function(err) {
console.log('Failure in events call');
                       

                    });

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: '<b>Events Location Wise & Status Wise Summary</b>'
    },
    xAxis: {

        categories: [
            'Kondapur',
            'Madhapur',
            'LB Nagar',
            'SR Nagar',
            'JNTU'
        ],
         lineWidth: 0.8,
              lineColor: 'black' , 
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: '<b>Events</b>',
        }
         
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        series: {
                    borderWidth: 1,
                    borderColor: 'grey'
                },
              
                column: {
                    pointPadding: 0.2,
                    borderWidth: 2
                }
    },
    series: [{
        name: 'Pending',
         dataLabels: {
                       enabled: true,
                  },
              
        data: [8,10,3,4,5]

    },  {
        name: 'Rejected',
         dataLabels: {
                       enabled: true,
                  },
              
        data: [2,6,4,9,1]

    }, {
        name: 'Approved',
         dataLabels: {
                       enabled: true,
                  },
              
        data: [4,5,8,3,7]

    }]
});


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

                         var Events = $scope.events;
                         var envCount=0;
                         var approvedCount=0;
                         var rejectedCount=0;
                         var pendingCount=0;

                         for(var i=0;i<Events.length;i++){

                          if(Events[i].status=="Approved"){
                            approvedCount++;
                          }
                          else if(Events[i].status=="Rejected"){
                            rejectedCount++;
                          }
                          else if(Events[i].status=="Submitted"){
                            pendingCount++;
                          }
                          
                         }

                         $scope.approved = approvedCount;
                         $scope.rejected = rejectedCount;
                         $scope.pending = pendingCount;



                        // $scope.events = eventsEnding ;

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

$scope.selectedEvent=null;
    $scope.selectedEvent = function(event) {
      
  
       $scope.event = event;

      // $scope.event.created =Date.parse(event.created);

       $scope.event.start = new Date(event.start);
       /*getDocuments(idSelectedVote);
       console.log(idSelectedVote);*/
    }
    

    //$scope.selectedEvent=null;
    $scope.locationBasedEvents = function(event) {
      
  
       var location = event.extras.grievance_location;

       var filteredEvents = [] ;

      
  }


    

    $scope.updateEvent=null;
    $scope.updateEvent = function(event) {
      
  
       $scope.event = event;
        //$scope.myModal.dismiss('cancel');
         $('#myModal').modal('hide');

         securityModel.postEventDetails(event).then(function(response) {
       
          var result=response;

          console.log('Successfull in updateEvent call');

          console.log('resoponse update'+JSON.stringify(response));

         securityModel.getEvents().then(function(response) {
                           
console.log('Successfull of events call');
                         $scope.events=response||response.data; 
                         //console.log('------'+JSON.stringify(markersMap));

                         drawMarker();
                        // console.log('------'+JSON.stringify(markersMap));
                         showOnMap();
                         if(!$scope.selectedValue){

                         var firstEvent=$scope.events[0];
             $scope.selectedValue=  firstEvent.id;
           }
           getDocuments($scope.selectedValue);
           $scope.setSelected($scope.selectedValue);


                        }).catch(function(err) {
console.log('Failure in events call');
                       

                    });

    }).catch(function(err) {
        console.log('Failure in updateEvent call');


    });

       //$scope.event.created = new Date(2013, 9, 22);
       /*getDocuments(idSelectedVote);
       console.log(idSelectedVote);*/
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
