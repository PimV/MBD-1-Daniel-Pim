// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//

$(document).ready(function () {

  $('#get-location-button').on('tap', function(e) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);  
  });
});


var onSuccess = function(position) {
    window.localStorage.setItem("lat", position.coords.latitude);
    window.localStorage.setItem("lon", position.coords.longitude);
/*
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');*/
};

// onError Callback receives a PositionError object
//
var onError = function(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}


//navigator.geolocation.getCurrentPosition(onSuccess, onError);