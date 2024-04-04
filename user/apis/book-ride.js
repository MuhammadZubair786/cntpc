db.collection("cars")
  .where("userID", "==", JSON.parse(localStorage.getItem("userDetailRide")).uid)
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
let calculatTransfer;

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
  distance:false,
  calculatTransfer:null,
  planName : null,
  finalPrice : null

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
  geocoder.geocode({ location: latLng }, async function (results, status) {
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

        if(bookRide.location1Lat!=null &&bookRide.location2Lat!=null ){
         

         var distance = calcDistance(bookRide.location1Lat,bookRide.location2Lng,bookRide.location2Lat,bookRide.location2Lng)
         
         document.getElementById("distance_row").style.display="inline"
         document.getElementById("distance_val").innerText = distance.toString().substring(0,5)+"Km"
         bookRide.distance=distance
         if (distance < 300) {
          await db.collection("Price_Adjusment").where("Km", "==", "Below 300")
              .get()
              .then((querySnapshot) => {
                  console.log(querySnapshot)
                  if (!querySnapshot.empty) {
                      const doc = querySnapshot.docs[0]; // Access the first (and only) document
                      const data = doc.data(); // Access the data of the document
                      calculatTransfer = (distance * Number(data.Price)).toFixed(3);
                      // Use the data as needed
                  } else {
                      console.log("No documents found");
                  }


              })

          // document.getElementById("cost_row").style.display="inline"
          // document.getElementById("estimate_cost").innerText = calculatTransfer+"€"
          bookRide.calculatTransfer=calculatTransfer
          document.getElementById("showplans").style.visibility="visible"



      } else {
          await db.collection("Price_Adjusment").where("Km", "==", "Above 300")
              .get()
              .then((querySnapshot) => {
                  console.log(querySnapshot)
                  if (!querySnapshot.empty) {
                      const doc = querySnapshot.docs[0]; // Access the first (and only) document
                      const data = doc.data(); // Access the data of the document
                      console.log(data);
                      calculatTransfer = (distance * Number(data.Price)).toFixed(3);
                      // Use the data as needed
                  } else {
                      console.log("No documents found");
                  }


              })
              // document.getElementById("cost_row").style.display="inline"
              // document.getElementById("estimate_cost").innerText = calculatTransfer+"€"
              bookRide.calculatTransfer=calculatTransfer

          document.getElementById("showplans").style.visibility="visible"

      }
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

function calcDistance (fromLat, fromLng, toLat, toLng) {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
}

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
                makePrice = (calculatTransfer * data.Plan_Multipler).toFixed(3);
            } else if (e.value == "Pro") {
              makePrice = (calculatTransfer *  data.Plan_Multipler).toFixed(3);
            } else if (e.value == "Lite") {
              makePrice = (calculatTransfer *  data.Plan_Multipler).toFixed(3);
            }
          } else {
              console.log("No documents found");
          }


      })
      // document.getElementById("price_show").innerText =makePrice
      // document.getElementById("pricetable").style.display="block"

      document.getElementById("cost_row").style.display="inline"
      document.getElementById("estimate_cost").innerText = makePrice+"€"
      bookRide.calculatTransfer=makePrice
      bookRide.planName = e.value
 

}

initMap();

$("#createRide").click(async function () {
  try {
    // Your data to be saved in Firestore
    if (bookRide?.carID != null) {


      if(JSON.parse(localStorage.getItem("userDetailRide")).uid){
        bookRide.userID = JSON.parse(localStorage.getItem("userDetailRide")).uid;
        bookRide.useremail = JSON.parse(localStorage.getItem("userDetailRide")).email;

        await db.collection("users").where("email", "==", JSON.parse(localStorage.getItem("userDetailRide")).email)
        .get().then((querySnapshot) => {
            console.log(querySnapshot)
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0]; // Access the first (and only) document
              const data = doc.data();
              bookRide.userFirstname=data.fname;
              bookRide.userLastname=data.lname;


            }})
        
      }

      console.log(bookRide)


      // var dis = calculateDistance(bookRide.location1Lat, bookRide.location1Lng, bookRide.location2Lat, bookRide.location2Lng)


      // Add the document to Firestore
      const docRef = await db.collection("orders").add(bookRide);

      // // // Get the ID of the created document
      const docId = docRef.id;

      // // // Save the document ID within the created record
      // // // For example, update the record with its own ID
      await docRef.update({ orderID: docId });

      // // Log success or perform other actions
      console.log("Document created with ID:", docId);

      window.location.href = "./rides.html";
    } else {
      alert("Select any one car");
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error adding document: " + error.message);
  }
});


function calculateDistance(lat1, lon1, lat2, lon2) {
  // const R = 6371; // Radius of the Earth in kilometers
  // const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
  // const dLon = (lon2 - lon1) * Math.PI / 180;
  // const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
  // const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // const distance = R * c; // Distance in kilometers
  // return distance;
  
  
  //  fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${lat1},${lon1}&destination=${lat2},${lon2}&key=AIzaSyCBcIqyF9MlONsxFqFrb1QHCTsxAFfwrhA`, requestOptions)
  //   .then((response) => response.text())
  //   .then((result) =>{
  //    console.log(result)
  //   } )
  //   .catch((error) => console.error(error));
  //   return mainresult

  fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))
}

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
