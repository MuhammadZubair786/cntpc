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

  initMap()