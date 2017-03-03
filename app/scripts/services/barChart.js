angular.module('ghmcApp')
            // Directive for generic chart, pass in chart options
            .directive('hcChart', function () {
                return {
                    restrict: 'E',
                    
                    scope: {
                        options: '=options'
                    },
                    link: function (scope, element) {
                        scope.$watch(function() { return scope.options; }, function(value) {
          if(!value) return;
            // We need deep copy in order to NOT override original chart object.
            // This allows us to override chart data member and still the keep
            // our original renderTo will be the same
            //var deepCopy = true;
            ///var newSettings = {};
           // $.extend(deepCopy, newSettings, chartsDefaults, scope.chartData);
             Highcharts.chart(element[0],value);
        });

                        
                    }
                };
            });