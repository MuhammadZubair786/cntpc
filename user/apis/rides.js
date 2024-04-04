let calPrice = 0;

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
                               
                                  Number(ride.distance).toFixed(3)
                                }Km</p>
                                </td>
                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                  Number(ride.calculatTransfer).toFixed(3)
                                }</p>
                                </td>
                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                  ride.planName
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
                                          <span><b>
                                       
                                          Transfer SucessFully</b></span>                                    
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

async function SendTransfer(e) {
    console.log(e.id)
    await db.collection("orders").where("orderID", "==", e.id)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                var data = doc.data();
                var {
                    location1Lat,
                    location1Lng,
                    location1Lat,
                    location2Lng
                } = data;
                var dis = calculateDistance(location1Lat, location1Lng, location1Lat, location2Lng)
                var calculatTransfer = 0;
                if (dis < 300) {
                    await db.collection("Price_Adjusment").where("Km", "==", "Below 300")
                        .get()
                        .then((querySnapshot) => {
                            console.log(querySnapshot)
                            if (!querySnapshot.empty) {
                                const doc = querySnapshot.docs[0]; // Access the first (and only) document
                                const data = doc.data(); // Access the data of the document
                                calculatTransfer = dis * Number(data.Price);
                                // Use the data as needed
                            } else {
                                console.log("No documents found");
                            }


                        })
                    calculatTransfer = dis * 1;

                } else {
                    await db.collection("Price_Adjusment").where("Km", "==", "Above 300")
                        .get()
                        .then((querySnapshot) => {
                            console.log(querySnapshot)
                            if (!querySnapshot.empty) {
                                const doc = querySnapshot.docs[0]; // Access the first (and only) document
                                const data = doc.data(); // Access the data of the document
                                console.log(data);
                                calculatTransfer = dis * Number(data.Price);
                                // Use the data as needed
                            } else {
                                console.log("No documents found");
                            }


                        })
                }
                console.log(calculatTransfer)
                calPrice = calculatTransfer;
                $("#transferModel").modal("show");
            });
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });

}

$(document).on("click", "#closeTransfer", function() {
    $("#transferModel").modal("hide");
});


async function selectPlan(e) {
    console.log(e.value)
    var makePrice = 0 ;

    await db.collection("Plans").where("Plan", "==", e.value)
        .get().then((querySnapshot) => {
            console.log(querySnapshot)
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0]; // Access the first (and only) document
                const data = doc.data(); // Access the data of the document
              

                if (e.value == "Normal") {
                  makePrice = calPrice * data.Plan_Multipler;
              } else if (e.value == "Pro") {
                makePrice = calPrice *  data.Plan_Multipler;
              } else if (e.value == "Lite") {
                makePrice = calPrice *  data.Plan_Multipler;
              }
            } else {
                console.log("No documents found");
            }


        })
        document.getElementById("price_show").innerText =makePrice
        document.getElementById("pricetable").style.display="block"
   

}


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

// Live Tracking Modal

$(document).on("click", "#trackLiveEvent", async function() {
    $("#liveTrackRiderModal").modal("show");
    await showLiveTracking(this.getAttribute("data-ride-id"));
});

$(document).on("click", "#closeTrackButton", function() {
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
    console.log({
        getDocData
    });
    if (getDocData) {
        if (getDocData?.liveLng && getDocData?.liveLat) {
            var myLatLng = {
                lat: getDocData?.liveLat,
                lng: getDocData?.liveLng
            };

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
                console.log({
                    trackMap
                });
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