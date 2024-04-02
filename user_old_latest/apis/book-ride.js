db.collection("cars")
  .get()
  .then((result) => {
    let i = 0;
    console.log(result.size);
    result.forEach((item) => {
      let ride = item.data();
      var option = $("<option></option>")
        .attr("value", ride.docID)
        .attr("data-value", ride.name)
        .text(ride.name);
      $("#carListForBooking").append(option);

      i++;
    });
  })
  .catch((err) => {
    window.alert(err.message);
  });

//   Map

// let lat = 33.5889;
// let lng = 71.4429;

// $(function() {

//     $('#us2').locationpicker({
//         location: {
//             latitude: 33.5889,
//             longitude: 71.4429
//         },
//         radius: 0,
//         inputBinding: {
//             latitudeInput: $('#lat'),
//             longitudeInput: $('#lng'),
//             locationNameInput: $('#location')
//         },
//         enableAutocomplete: true,
//         onchanged: function(currentLocation, radius, isMarkerDropped) {

//             lat = currentLocation.latitude;
//             lng = currentLocation.longitude

//             alert(lat)

//         }
//     });
//     $('#us1').locationpicker({
//         location: {
//             latitude: 33.5889,
//             longitude: 71.4429
//         },
//         radius: 0,
//         inputBinding: {
//             latitudeInput: $('#lat'),
//             longitudeInput: $('#lng'),
//             locationNameInput: $('#location')
//         },
//         enableAutocomplete: true,
//         onchanged: function(currentLocation, radius, isMarkerDropped) {

//             lat = currentLocation.latitude;
//             lng = currentLocation.longitude

//         }
//     });

// });

let map;
let geocoder;

let mapFrom;

let bookRide = {
  carID: null,
  carName: null,
  location1Lat: null,
  Location1Lng: null,
  location1Name: null,

  location2Lat: null,
  Location2Lng: null,
  location2Name: null,
  reached: false,
};

$("#carListForBooking").change(function () {
  var selectedOption = $(this).val();
  var selectedOptionDataKey = $(this).find("option:selected").data("value");

  if (selectedOptionDataKey && selectedOption) {
    bookRide.carID = selectedOption;
    bookRide.carName = selectedOptionDataKey;
  }
  // Perform actions based on the selected option
  console.log("Selected option:", selectedOption, selectedOptionDataKey);
  // Add your actions here
});

function initMap() {
  var myLatLng = { lat: 24.9493505, lng: 67.0658986 };
  map = new google.maps.Map(document.getElementById("us2"), {
    center: myLatLng,
    zoom: 11,
  });

  mapFrom = new google.maps.Map(document.getElementById("us1"), {
    center: myLatLng,
    zoom: 11,
  });

  geocoder = new google.maps.Geocoder();

  map.addListener("click", function (event) {
    getAddress(event.latLng, "to");
  });

  mapFrom.addListener("click", function (event) {
    getAddress(event.latLng, "from");
  });
}

function getAddress(latLng, type) {
  geocoder.geocode({ location: latLng }, function (results, status) {
    if (status === "OK") {
      if (results[0]) {
        console.log(
          latLng.lat(),
          latLng.lng(),
          results[0].formatted_address,
          results[0]
        );
        if (type == "to") {
          $("#selectedToLocation").html(`
            <h5>Selectd Location :<span class="text-secondary"> ${results[0].formatted_address}</span></h5> 
            `);

          bookRide.location2Lat = latLng.lat();
          bookRide.location2Lng = latLng.lng();
          bookRide.location2Name = results[0].formatted_address;
        }

        if (type == "from") {
          $("#selectedFromLocation").html(`
              <h5>Selectd Location :<span class="text-secondary"> ${results[0].formatted_address}</span></h5> 
            `);

          bookRide.location1Lat = latLng.lat();
          bookRide.location1Lng = latLng.lng();
          bookRide.location1Name = results[0].formatted_address;
        }
        // document.getElementById("latitude").innerText = latLng.lat();
        // document.getElementById("longitude").innerText = latLng.lng();
        // document.getElementById("locationName").innerText =
        //   results[0].formatted_address;
      } else {
        alert("No results found");
      }
    } else {
      alert("Geocoder failed due to: " + status);
    }
  });
}

initMap();

$("#createRide").click(async function () {
  try {
    // Your data to be saved in Firestore

    // Add the document to Firestore
    const docRef = await db.collection("orders").add(bookRide);

    // Get the ID of the created document
    const docId = docRef.id;

    // Save the document ID within the created record
    // For example, update the record with its own ID
    await docRef.update({ orderID: docId });

    // Log success or perform other actions
    console.log("Document created with ID:", docId);

    window.location.href = "./rides.html";
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error adding document: " + error.message);
  }
});

// var myLatLng = { lat: -25.363, lng: 131.044 }; // Replace with your desired coordinates

// var mapItem = new google.maps.Map(document.getElementById("us2"), {
//   zoom: 4,
//   center: myLatLng,
// });

// var marker = new google.maps.Marker({
//   position: myLatLng,
//   map: mapItem,
//   title: "Hello World!",
// });
