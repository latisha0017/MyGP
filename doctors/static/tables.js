function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
    }

var csrftoken = getCookie('csrftoken');

function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Description: </td>'+
            '<td> '+d.description+'</td>'+
        '</tr>'+
		'<tr>'+
            '<td>Appointment Type: </td>'+
            '<td> '+d.appType+'</td>'+
        '</tr>'+
    '</table>';
}

    $(document).ready( function () {


    var table = $('#patientTableUpcoming').DataTable({
    	"pageLength": 5,
  		"lengthMenu": [ [5, 10, 20, -1], [5, 10, 20, "All"] ],
    	ajax: {
    		url: 'http://localhost:8000/api/appointment-list-future/',
    		dataSrc: ''
    },
    	columns: [
            {
            'className':'d-control',
            'orderable':false,
            'data':null,
            'defaultContent':'',
            "render": function () 
                {return '<i class="fa fa-plus-square" aria-hidden="true"></i>';},
            width:"15px"},
    		{data : 'date'},
    		{data : 'timeslot'},
    		{data : 'doctor'},
			{ 'data': null, title: 'Action', wrap: true, width:"30px", "render": function (item) { 
				return `<a class="btn-group" >
					 <button type="button" class="btn btn-info">Cancel</button>` }
		 },
    	]
    	}); 

		$('#patientTableUpcoming tbody').on( 'click', 'button', function () {
        var app = table.row( $(this).parents('tr') ).data();
		var result = confirm("Are you sure you want to cancel this appointment?");
			if (result) {
				fetch(`http://localhost:8000/api/appointment-cancel/${app.id}/`, {
			method: 'DELETE',
			headers:{
				'Content-type':'application/json',
				'X-CSRFToken':csrftoken,
			}
		}).then((response) => {
			table.ajax.reload();
		})
		}
} );

$('#doctorTableUpcoming tbody').on( 'click', 'button', function () {
    var app = table3.row( $(this).parents('tr') ).data();
    var result = confirm("Are you sure you want to cancel this appointment?");
        if (result) {
            fetch(`http://localhost:8000/api/appointment-cancel/${app.id}/`, {
        method: 'DELETE',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        }
    }).then((response) => {
        table3.ajax.reload();
    })
    }
} );

		var table2 = $('#patientTablePast').DataTable({
    	"pageLength": 5,
  		"lengthMenu": [ [5, 10, 20, -1], [5, 10, 20, "All"] ],
    	ajax: {
    		url: 'http://localhost:8000/api/appointment-list-past/',
    		dataSrc: ''
    },
    	columns: [
		{
        'className':'d-control',
        'orderable':false,
        'data':null,
        'defaultContent':'',
		"render": function () {
                         return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
                     },
		width:"15px"
        },
    		{data : 'date'},
    		{data : 'timeslot'},
    		{data : 'doctor'}
    	]
    	});

		var table3 = $('#doctorTableUpcoming').DataTable({
    	"pageLength": 5,
  		"lengthMenu": [ [5, 10, 20, -1], [5, 10, 20, "All"] ],
    	ajax: {
    		url: 'http://localhost:8000/api/appointment-list-future/',
    		dataSrc: ''
    },
    	columns: [
		{
        'className':'d-control',
        'orderable':false,
        'data':null,
        'defaultContent':'', "render": function () 
            {return '<i class="fa fa-plus-square" aria-hidden="true"></i>';},
		width:"15px"
        },
		{data : 'date'},
    	{data : 'timeslot'},
    	{data : 'patient'},
        { 'data': null, title: 'Action', wrap: true, width:"30px", "render": function (item) { 
            return `<a class="btn-group" >
                 <button type="button" class="btn btn-info">Cancel</button>` }
     },
    	]
    	});

		var table4 = $('#doctorTablePast').DataTable({
    	"pageLength": 5,
  		"lengthMenu": [ [5, 10, 20, -1], [5, 10, 20, "All"] ],
    	ajax: {
    		url: 'http://localhost:8000/api/appointment-list-past/',
    		dataSrc: ''
    },
    	columns: [
		{
        'className':'d-control',
        'orderable':false,
        'data':null,
        'defaultContent':'',
		"render": function () {
            return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
        },
		width:"15px"
        },
				{data : 'date'},
    			{data : 'timeslot'},
    			{data : 'patient'}
    	]
    	});

		$('#patientTableUpcoming tbody').on('click', 'td.d-control', function () {
             var tr = $(this).closest('tr');
             var tdi = tr.find("i.fa");
             var row = table.row(tr);

             if (row.child.isShown()) {
                 // This row is already open - close it
                 row.child.hide();
                 tr.removeClass('shown');
                 tdi.first().removeClass('fa-minus-square');
                 tdi.first().addClass('fa-plus-square');
             }
             else {
                 // Open this row
                 row.child(format(row.data())).show();
                 tr.addClass('shown');
                 tdi.first().removeClass('fa-plus-square');
                 tdi.first().addClass('fa-minus-square');
             }

         });

		 $('#patientTablePast tbody').on('click', 'td.d-control', function () {
             var tr = $(this).closest('tr');
             var tdi = tr.find("i.fa");
             var row = table2.row(tr);

             if (row.child.isShown()) {
                 // This row is already open - close it
                 row.child.hide();
                 tr.removeClass('shown');
                 tdi.first().removeClass('fa-minus-square');
                 tdi.first().addClass('fa-plus-square');
             }
             else {
                 // Open this row
                 row.child(format(row.data())).show();
                 tr.addClass('shown');
                 tdi.first().removeClass('fa-plus-square');
                 tdi.first().addClass('fa-minus-square');
             }

         });

         $('#doctorTableUpcoming tbody').on('click', 'td.d-control', function () {
            var tr = $(this).closest('tr');
            var tdi = tr.find("i.fa");
            var row = table3.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
                tdi.first().removeClass('fa-minus-square');
                tdi.first().addClass('fa-plus-square');
            }
            else {
                // Open this row
                row.child(format(row.data())).show();
                tr.addClass('shown');
                tdi.first().removeClass('fa-plus-square');
                tdi.first().addClass('fa-minus-square');
            }

        });

        $('#doctorTablePast tbody').on('click', 'td.d-control', function () {
            var tr = $(this).closest('tr');
            var tdi = tr.find("i.fa");
            var row = table4.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
                tdi.first().removeClass('fa-minus-square');
                tdi.first().addClass('fa-plus-square');
            }
            else {
                // Open this row
                row.child(format(row.data())).show();
                tr.addClass('shown');
                tdi.first().removeClass('fa-plus-square');
                tdi.first().addClass('fa-minus-square');
            }

        });
	
});
