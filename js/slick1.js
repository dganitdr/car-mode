var app = angular.module('slick1App', [])

.controller('slick1Ctrl', function($scope, $timeout, getData) {

  var self = this;
  var myData = {};
  var dataView;

  /* has to call 'then' because otherwise we will get the results (empty) before the service is done */
  /* only after the service is done and resolved (not rejected), only then we get the data */
  getData.async().then(function() {
    myData = getData.data();
    console.log('gg ', myData);
  });  

  var target = document.getElementById('mySpin')
  var spinner = new Spinner().spin(target);
  $scope.spin1 = false;
  $scope.stopSpin = function() {
    $scope.spin1 = true;
    spinner.stop(); 
  }

  self.deleteMe = function() {
    alert('ff');
  }
})
.directive('myDir', function(getData) {
  return {
      restrict: 'E',
      template: '<button ng-click="clickFunc()">CLICK</button>',
      link: function (scope, element, attrs) {
          scope.clickFunc = function () {
              alert('Hello, world!');
          };
        element.bind("mouseenter", function(){
          scope.slick.deleteMe();
        });
      }
  }
})
.directive('myGrider', function(getData) {
  var template = '<div id="myGrid">Hello Grid</div>';

  function buttonFormatter(row,cell,value,columnDef,dataContext){  
      var button = '<button type="button" class="btn btn-danger deleteM">Delete</button>';
      //the id is so that you can identify the row when the particular button is clicked
      return button;
      //Now the row will display your button
  }  


  return {
    restrict: 'E',
    template: template,
//    templateUrl: 'dialog.html'
    link : function(scope, element, attrs){
//      var grid;
      var myData2 = {};
      var columns = [
        {id: "id", name: "id", field: "id", sortable: true},
        {id: "duration", name: "Duration", field: "duration", sortable: true},
        {id: "%", name: "% Complete", field: "percentComplete", sortable: true},
        {id: "start", name: "Start", field: "start", sortable: true},
        {id: "finish", name: "Finish", field: "finish", sortable: true},
        {id: "effort-driven", name: "Effort Driven", field: "effortDriven", sortable: true},
        {id: "delCol", field: "del", name: "Delete", width:250, formatter:buttonFormatter}
      ];

      var options = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        multiColumnSort: true
      };

      var data = [];
      /* via json variable */
      for (var i = 0; i < myData.length; i++) {
        data[i] = {
          id: myData[i].id,
          duration: myData[i].duration,
          percentComplete:myData[i].percentComplete,
          start: myData[i].start,
          finish: myData[i].finish,
          effortDriven: myData[i].effort,
          del: 'delete'
        };
//          console.log(myData[i]);
      }

      /* has to call 'then' because otherwise we will get the results (empty) before the service is done */
      /* only after the service is done and resolved (not rejected), only then we get the data */
//       getData.async().then(function() {
//         myData2 = getData.data();
//         console.log('gg2 ', myData2);
//         console.log('gg3 ', myData2.records[3]);
//       /* via Get service */
//         for (var i = 0; i < myData.length; i++) {
// //          data[i] = myData2.records[i];
//           data[i] = {
//             title: myData2.records[i].title,
//             duration: myData2.records[i].duration,
//             percentComplete:myData2.records[i].percentComplete,
//             start: myData2.records[i].start,
//             finish: myData2.records[i].finish,
//             effortDriven: myData2.records[i].effort
//           };
//           console.log(data[i]);
//         }
//         scope.grid = new Slick.Grid("#myGrid", data, columns, options);
//         scope.grid.onSort.subscribe(function (e, args) {
//           var cols = args.sortCols;

//           data.sort(function (dataRow1, dataRow2) {
//             for (var i = 0, l = cols.length; i < l; i++) {
//               var field = cols[i].sortCol.field;
//               var sign = cols[i].sortAsc ? 1 : -1;
//               var value1 = dataRow1[field], value2 = dataRow2[field];
//               var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
//               if (result != 0) {
//                 return result;
//               }
//             }
//             return 0;
//           });
//           scope.grid.invalidate();
//           scope.grid.render();
//         });
//       });  


    dataView = new Slick.Data.DataView();    
    dataView.beginUpdate();
    dataView.setItems(data);
    dataView.endUpdate();

        scope.grid = new Slick.Grid("#myGrid", dataView, columns, options);
        scope.grid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
        scope.grid.onSort.subscribe(function (e, args) {
          var cols = args.sortCols;

          dataView.sort(function (dataRow1, dataRow2) {
            for (var i = 0, l = cols.length; i < l; i++) {
              var field = cols[i].sortCol.field;
              var sign = cols[i].sortAsc ? 1 : -1;
              var value1 = dataRow1[field], value2 = dataRow2[field];
              var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
              if (result != 0) {
                return result;
              }
            }
            return 0;
          });
          scope.grid.invalidate();
          scope.grid.render();
        });

        scope.grid.onClick.subscribe(function (e, args) {
            if ($(e.target).hasClass("btn")) {
                var item = dataView.getItem(args.row);
                console.log(item, args.row);
                var myId = item.id;
                dataView.deleteItem(myId);
                scope.grid.render();
            }
            e.stopImmediatePropagation();
        });

        dataView.onRowCountChanged.subscribe(function (e, args) {
          scope.grid.updateRowCount();
          scope.grid.render();
        });

        dataView.onRowsChanged.subscribe(function (e, args) {
          scope.grid.invalidateRows(args.rows);
          scope.grid.render();
        });

    }
  }
})
.factory('getData', function($http, $q) {
  var deffered = $q.defer();
  var data = [];  
  var getData = {};

  /* wait until 'get' service is done and resolved (not rejected) */
  getData.async = function() {
    $http.get('js/data.php')
    .success(function (d) {
      data = d;
      console.log('hh2 ', data);
      console.log(d);
      deffered.resolve();
    });
    console.log('rr ',deffered.promise);
    return deffered.promise;
  };
  getData.data = function() { 
    return data; 
  };
  return getData;
});
