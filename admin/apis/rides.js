let trackMap;
var markerPosition;

db.collection("orders")
  .get()
  .then((result) => {
    let i = 0;

    result.forEach((item) => {
      let ride = item.data();
      console.log({ ride }, ride?.ride_start, !ride?.ride_start);
      $("#ridesTable").append(`
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
                                  ride.driverName
                                }</p>
                                </td>

                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                  ride.location1Name
                                }</p>
                                </td>


                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                  ride.location2Name
                                }</p>
                                </td>
                                
                                <td class="align-middle text-center text-sm">
                                    <p class="text-xs text-secondary mb-0">${
                                      ride.reached == false
                                        ? "In Progress"
                                        : "Reached"
                                    }</p>
                                </td>
                                ${
                                  !ride.driverID
                                    ? `<td>
                                            <button class="btn btn-success text-light text-xs  mb-0" id="assignRiderButton" data-ride-id=${ride.orderID}>Assign Driver</button>
                                      </td>`
                                    : ride.hasOwnProperty("ride_start")
                                    ? ride?.ride_start === true
                                      ? `<td>
                                              <button class="btn btn-warning text-xs text-light mb-0" id="trackLiveEvent" data-ride-id=${ride.orderID}>Live Tracking</button>
                                        </td>`
                                      : ride?.ride_start == false
                                      ? `<td>
                                              <span><b>Transfer Completed </b></span>                                    
                                            </td>`
                                      : `<td>
                                                <span>Transfer did not started</span>
                                          </td>`
                                    : `<td>
                                          <span>Transfer not started</span>
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
$(document).on("click", "#assignRiderButton", function () {
  rideID = this.getAttribute("data-ride-id");
  db.collection("drivers")
    .get()
    .then((result) => {
      let i = 0;
      result.forEach((item) => {
        let driver = item.data();
        $("#driverList").append(`
                <div class="d-flex justify-content-between my-3">
                    <span>
                        ${driver.fname} ${driver.lname}
                    </span>
                    <button class="btn btn-warning text-xs text-secondary mb-0 assign-btn-rider" onclick="assingRiderToRide(this)" id="assign-btn-rider" data-driver-id=${driver.docID}>
                        Assign 
                    </button>
                    </div>
        `);
        i++;
      });

      $("#assignRideToDriverModal").modal("show");
    })
    .catch((err) => {
      window.alert(err.message);
    });
});

$(document).on("click", "#closeassignRiderButton", function () {
  $("#assignRideToDriverModal").modal("hide");
});
$(document).on("click", "#closeTrackButton", function () {
  $("#liveTrackRiderModal").modal("hide");
});

// Get Data to Map

// var db = firebase.firestore();

// // Assuming you have a collection named 'users'
// var usersCollection = db.collection('users');

// // Assuming you have a document with an ID 'exampleDocument'
// var exampleDocument = usersCollection.doc('exampleDocument');

// // Get data from the document
// exampleDocument.get().then(function(doc) {
//     if (doc.exists) {
//         console.log('Document data:', doc.data());
//     } else {
//         console.log('Document not found');
//     }
// }).catch(function(error) {
//     console.error('Error getting document:', error);
// });

async function getDocumentData(_id) {
  const snapshot = await db.collection("orders").doc(_id).get();
  if (snapshot.exists) {
    return snapshot.data();
  } else {
    return null;
  }
}

// Live Tracking Modal

$(document).on("click", "#trackLiveEvent", async function () {
  rideID = this.getAttribute("data-ride-id");

  $("#liveTrackRiderModal").modal("show");
  await showLiveTracking(this.getAttribute("data-ride-id"));
});

async function assingRiderToRide(element) {
  console.log({ element, rideID }, element.getAttribute("data-driver-id"));
  let spinner = `<div class="spinner-border text-dark" role="status">
  <span class="sr-only">Loading...</span>
</div>
`;
  element.innerHTML = spinner;
  try {
    // Get data from the source collection
    const sourceCollection = await db
      .collection("drivers")
      .doc(element.getAttribute("data-driver-id"))
      .get();
    const data = sourceCollection.data();

    // Update data in the destination collection
    await db
      .collection("orders")
      .doc(rideID)
      .update({
        driverName: data?.fname + " " + data?.lname,
        driverID: element.getAttribute("data-driver-id"),
      });

    // Display success message
    element.innerHTML = "Assign";

    $("#assignRideToDriverModal").modal("hide");

    window.location.href = "./rides.html";
  } catch (error) {
    console.error("Error updating document:", error);
    // Display error message
    document.getElementById("result").innerText =
      "Error updating document. Check the console for details.";
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
      if (rideID == getDocData?.orderID) {
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
