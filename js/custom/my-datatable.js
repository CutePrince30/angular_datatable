var TableDatatablesManaged = function() {

  var init = function() {
    $('#example').DataTable( {
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": angular.element("#demoApp").scope().settings.serverUrl + '/user/list',
            "type": "GET"
        },
        // "initComplete": function(settings, json) {
        //   console.log(json);
        // },
        "columns": [
            { "data": null },
            { "data": "id" },
            { "data": "name", render: function ( data, type, full, meta ) {
              var id = full.id;
              return '<a href="#/view/'+id+'">'+data+'</a>';
            } },
            { "data": "sex" },
            { "data": "age" }
        ],
        "fnCreatedRow": function (row, data, index) {
            $('td', row).eq(0).html(index + 1);
        }
        // "columnDefs": [ {
        //   "targets": 2,
        //   "data": "name",
        //   "render": function ( data, type, full, meta ) {
        //     var id = full.id;
        //     return '<a href="#/view/'+id+'">'+data+'</a>';
        //   }
        // } ]
    } );
  }

  return {
    init : function() {
      init();
    }
  }

}();
