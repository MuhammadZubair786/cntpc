db.collection("orders").where("userID", "==", JSON.parse(localStorage.getItem("userDetailRide")).uid)
  .get()
  .then((result) => {
    let i = 0;
    console.log(result.size);
    result.forEach((item) => {
      let ride = item.data();
      $("#coursesTable").append(`
        <tr>
                                <td>
                                <div class="d-flex px-2 py-1">
                                    
                                    <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-sm">${
                                      ride.orderID
                                    }</h6>
                                    
                                    </div>
                                </div>
                                </td>

                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                  ride.carName ?? ""
                                }</p>
                                </td>

                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                  ride.driverName ?? ""
                                }</p>
                                </td>


                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                  ride.reached ? "Reached" : "Not Reached"
                                }</p>
                                </td>
                                
                                ${
                                  ride?.ride_start && !ride.driverID
                                    ? `<td>
                                            Rider Not Assigned Yet
                                      </td>`
                                    : ride?.ride_start === true
                                    ? `<td>
                                            <button class="btn btn-warning text-xs text-secondary mb-0" id="trackLiveEvent" data-ride-id=${ride.orderID}>Live Tracking</button>
                                    </td>`
                                    : ride?.ride_start == false
                                    ? `<td>
                                          <span><b>Transfer Completed</b></span>                                    
                                        </td>`
                                    : `<td>
                                            <span>Transfer did not started</span>
                                      </td>`
                                }
                                

                                
                            </tr>
        `);

      i++;
    });
  })
  .catch((err) => {
    window.alert(err.message);
  });
let rideID;
let trackMap;
let markerPosition;

// Live Tracking Modal

$(document).on("click", "#trackLiveEvent", async function () {
  $("#liveTrackRiderModal").modal("show");
  await showLiveTracking(this.getAttribute("data-ride-id"));
});

$(document).on("click", "#closeTrackButton", function () {
  $("#liveTrackRiderModal").modal("hide");
});

async function getDocumentData(_id) {
  const snapshot = await db.collection("orders").doc(_id).get();
  if (snapshot.exists) {
    return snapshot.data();
  } else {
    return null;
  }
}

async function showLiveTracking(order_id) {
  let getDocData = await getDocumentData(order_id);
  console.log({ getDocData });
  if (getDocData) {
    if (getDocData?.liveLng && getDocData?.liveLat) {
      var myLatLng = { lat: getDocData?.liveLat, lng: getDocData?.liveLng };

      // Create a new map centered at the specified coordinates
      trackMap = new google.maps.Map(document.getElementById("liveTrackMap"), {
        center: myLatLng,
        zoom: 13,
      });

      // Add a marker at the specified coordinates
      markerPosition = new google.maps.Marker({
        position: myLatLng,
        map: trackMap,
        title: "Current Location",
      });
    } else {
      $("#liveTrackMap").html(
        `<div class="d-flex justify-content-center align-items-center h-100"><h3>No Live Tracking Available</h3></div>`
      );
    }
  }
}

// Live Track

// Function to update the map with the latest location
function updateMap(latitude, longitude) {
  // Implement your logic to update the map using latitude and longitude
  // You can use a mapping library like Leaflet or Google Maps for this
  console.log(`Updating map with coordinates: (${latitude}, ${longitude})`);
}

// Function to handle changes in location data
function handleLocationChange(snapshot) {
  snapshot.docChanges().forEach((change) => {
    const data = change.doc.data();

    const getDocData = data;

    if (getDocData) {
      if (getDocData?.liveLng && getDocData?.liveLat) {
        // Add a marker at the specified coordinates
        console.log({ trackMap });
        var newPosition = new google.maps.LatLng(
          getDocData?.liveLat,
          getDocData?.liveLng
        );
        trackMap?.setCenter(newPosition);
        markerPosition?.setPosition(newPosition);
      } else {
        $("#liveTrackMap").html(
          `<div class="d-flex justify-content-center align-items-center h-100"><h3>No Live Tracking Available</h3></div>`
        );
      }
    }
    // const latitude = data.latitude;
    // const longitude = data.longitude;

    // // Update the map with the latest location
    // updateMap(latitude, longitude);
  });
}

// Set up a real-time listener for location data changes
function listenForLocationChanges() {
  db.collection("orders").onSnapshot(handleLocationChange);
}

// Start listening for changes
listenForLocationChanges();
