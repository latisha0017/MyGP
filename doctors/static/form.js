$(function(){

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

var form = document.getElementById('myForm')
form.addEventListener('submit', function(e){
    e.preventDefault()

    var url = 'http://localhost:8000/api/appointment-create/'
    var doctor = document.getElementById('doctor').value
    var date = document.getElementById('date').value
    var timeslot = document.getElementById('timeslot').value
	var appType = document.getElementById('type').value
	var description = document.getElementById('description').value

	if (description === '') {
		alert("Please provide a brief description of your medical problem")
	}
	else if(date === '' || timeslot === ''){
		alert("Please select a date and time ")
	}
	else{
		fetch(url, {
			method: 'POST',
			headers:{
				'Content-type' : 'application/json',
				'X-CSRFToken' : csrftoken
			},
			body:JSON.stringify({
				'doctor': Number(doctor),
				'patient': patient,
				'date': date,
				'timeslot': timeslot,
				'appType': appType,
				'description': description,
			})
		}).then(function(response){
			alert("Your appointment has been booked on "+ date + " at " + timeslot)
			window.location.replace('http://localhost:8000/appointments')
		})

	}
})

	var doctors;

	$.getJSON('http://localhost:8000/api/account-list/', function(result){
		$.each(result, function(i, account){
			if (account.is_doctor){
				doctors += "<option value='"+account.id+"'>Dr. " +account.first_name+" "+account.last_name+"</option>";
			}
		});
		$('#doctor').html(doctors);
	});

	var timeslots = [
		'09:00 – 09:30','10:00 – 10:30', '11:00 – 11:30', '12:00 – 12:30', '13:00 – 13:30', 
		'14:00 – 14:30', '15:00 – 15:30', '16:00 – 16:30', '17:00 – 17:30'];

	$('#doctor, #date').change(function(){
		$('#timeslot').empty();

		$.each(timeslots, function(i, p) {
    	$('#timeslot').append($('<option></option>').val(p).html(p));
		});

		$.getJSON('http://localhost:8000/api/all-appointments/', function(result){
			$.each(result, function(i, appointment){
				 if ((appointment.doctor == document.getElementById('doctor').value) && 
				 	(appointment.date == $('#date').val())) {
				 		var booked = appointment.timeslot
						$("#timeslot").val([]);
				 		$("#timeslot option[value='" +booked+ "']").hide();
				 }
			});
		});
	});
});
