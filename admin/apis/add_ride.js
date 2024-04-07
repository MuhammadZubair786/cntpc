let userID = ""
let userName = ""
let calPrice = 0;


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
            calPrice = calculatTransfer;
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
                calPrice = calculatTransfer;  
  
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

  db.collection('users').orderBy('date', 'desc').get().then((result) => {
    let i = 0;
    result.forEach((item) => {
        let user = item.data()

        $('#usersData').append(`
        <a class="dropdown-item" id="selectUser${i}">${user.fname + ' ' + user.lname}</a>
        `)

        $(`#selectUser${i}`).on('click', () => {

            $('#usersDropDown').html(user.fname + ' ' + user.lname);
            // document.getElementById("carData").innerHTML=""

            userID = user.docID;
            userName = user.fname + ' ' + user.lname;
            bookRide.userID=userID
            bookRide.useremail =user.email
            bookRide.userFirstname=user.fname;
            bookRide.userLastname=user.lname;

            getCarsData(userID)

        })
        i++;
    })
}).catch((err) => {
    window.alert(err.message);
});


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


      document.getElementById("cost_row").style.display="inline"
      document.getElementById("estimate_cost").innerText = Number(makePrice).toFixed(3)+"€"
      bookRide.calculatTransfer=makePrice
      bookRide.planName = e.value
 

}

function getCarsData(id){

  db.collection('cars').where('userID', '==', id).get().then((result) => {
  console.log(id)
  var i=0;
  $('#carData').empty();

    result.forEach((item) => {

      let cars = item.data()
      
      $('#carData').append(`
      <a class="dropdown-item" id="SelectCar${i}">${cars.name}</a>
      `)

      $(`#SelectCar${i}`).on('click', () => {

        bookRide.carID = cars.docID;
        bookRide.carName = cars.name;

          $('#carDropDown').html(cars.name);
      })
    
    })
    i++;
  })
  

}

async function CheckData(){
   if(bookRide.userFirstname==null || bookRide.userFirstname==""){
    alert("select User")
  }
  else if(bookRide.carName==null || bookRide.carName==""){
    alert("select Car ")
  }
  else{
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
  }
 


}


initMap()