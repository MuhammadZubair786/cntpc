let lat = 33.5889;
let lng = 71.4429;

$(function() {

    $('#us2').locationpicker({
        location: {
            latitude: 33.5889,
            longitude: 71.4429
        },
        radius: 0,
        inputBinding: {
            latitudeInput: $('#lat'),
            longitudeInput: $('#lng'),
            locationNameInput: $('#location')
        },
        enableAutocomplete: true,
        onchanged: function(currentLocation, radius, isMarkerDropped) {

            lat = currentLocation.latitude;
            lng = currentLocation.longitude

        }
    });
    $('#us1').locationpicker({
        location: {
            latitude: 33.5889,
            longitude: 71.4429
        },
        radius: 0,
        inputBinding: {
            latitudeInput: $('#lat'),
            longitudeInput: $('#lng'),
            locationNameInput: $('#location')
        },
        enableAutocomplete: true,
        onchanged: function(currentLocation, radius, isMarkerDropped) {

            lat = currentLocation.latitude;
            lng = currentLocation.longitude

        }
    });


});