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
          
  .controller('dashboardCtrl', function (SecureStorage,securityModel,$scope,$q,$rootScope,Chart,$filter) {

     $scope.chartConfig = Chart;
  
              
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
  //$scope.sortType     = 'created'; // set the default sort type
  //$scope.sortReverse  = true;  // set the default sort order
  $scope.searchFish   = ''; 
  $scope.members   = null;  
  $scope.Users=[];  // set the default search/filter term
  securityModel.getEvents().then(function(response) {
                           
console.log('Successfull of events call');
                         $scope.events=response||response.data; 
                        //pie chart logic
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
			//end of pie chart
                         //console.log('------'+JSON.stringify(markersMap));

                         drawMarker();
                        // console.log('------'+JSON.stringify(markersMap));
                         showOnMap();
                         $scope.getEventFilter('Submitted');
                         if(!$scope.selectedValue){

                         var firstEvent=$scope.filteredEvents[0];
                         // $scope.members =$scope.events[0].extras.joined_members;
             $scope.selectedValue=  firstEvent.id;
           }
           getEventFilterCount();
           //getDocuments($scope.selectedValue);
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
                         
           //getDocuments($scope.selectedValue);
           $scope.getEventFilter($scope.selectedFilterStatus);
           getEventFilterCount();
            var firstEvent=$scope.filteredEvents[0];
                         // $scope.members =$scope.events[0].extras.joined_members;
             $scope.selectedValue=  firstEvent.id;
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
 //filters
 $scope.Upcoming=0;
 $scope.Approved=0;
 $scope.Rejected=0;
 $scope.Submitted=0;
 $scope.getEventFilter=function(filterEvent){
  $scope.searchFish='';
$scope.EventText=filterEvent+' Events'
  $scope.selectedFilterStatus=filterEvent;
  $scope.sortType     = null; // set the default sort type
  $scope.sortReverse  = null;  // set the default sort order
   $scope.filteredEvents = $filter('orderBy')($scope.events, function(event){
            console.log(new Date(event.created));
                return new Date(event.created);
            },true);
  if(filterEvent=='Upcoming'){
    
     $scope.filteredEvents = $filter('filter')($scope.filteredEvents, function(event){
            
                return new Date(event.start)>new Date();
            });
      
  }
  else{
     $scope.filteredEvents = $filter('filter')($scope.filteredEvents, function(event){
            
                return event.status==filterEvent;
            });
  }
            var firstEvent=$scope.filteredEvents[0];
                         // $scope.members =$scope.events[0].extras.joined_members;
             $scope.selectedValue=  firstEvent.id;
             $scope.setSelected($scope.selectedValue);

 };

  function getEventFilterCount(){
     $scope.UpcomingEvents = $filter('filter')($scope.events, function(event){
            
                return new Date(event.start)>new Date();
            });
     $scope.ApprovedEvents = $filter('filter')($scope.events, function(event){
            
                return event.status=='Approved';
            });
     $scope.RejectedEvents = $filter('filter')($scope.events, function(event){
            
                return event.status=='Rejected';
            });
     $scope.SubmittedEvents = $filter('filter')($scope.events, function(event){
            
                return event.status=='Submitted';
            });


     $scope.Upcoming=$scope.UpcomingEvents.length;
     $scope.Approved=$scope.ApprovedEvents.length;
     $scope.Rejected=$scope.RejectedEvents.length;
      $scope.Submitted=$scope.SubmittedEvents.length;

  };
  ///////////for charts data
        // Sample options for first chart
                $scope.chartOptions =  {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Monthly Average Rainfall'
    },
    subtitle: {
        text: 'Source: WorldClimate.com'
    },
    xAxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Rainfall (mm)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Tokyo',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

    }, {
        name: 'New York',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

    }, {
        name: 'London',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

    }, {
        name: 'Berlin',
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

    }]
};


  });
