function login() {
  // window.location.href = '/admin/dashboard.html'

  $("#errorMessage").html("");
  let routeToNext = "./dashboard.html";

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (email === "" || password === "")
    return window.alert("Please enter all required fields");

firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      // Signed in
      var user = userCredential.user;

      if (userCredential.user) {
        const checkInUser = await db.collection("users").doc(user.uid).get();

        if (!checkInUser.exists) {
          let errorMessage = `
                 <div class="bg-danger w-100 my-4 mb-2 py-2 text-light">
                   INVALID_LOGIN_CREDENTIALS
                 </div>`;

          $("#errorMessage").html(errorMessage);
          return false;
        }
        localStorage.setItem(
          "userDetailRide",
          JSON.stringify(userCredential.user)
        );
        window.location.href = routeToNext;
      }
    })
    .catch((err) => {
      console.log(JSON.parse(err.message));
      let errorItem = JSON.parse(err.message);
      let errorMessage = `
        <div class="bg-danger w-100 my-4 mb-2 py-2 text-light">
            ${errorItem?.error?.message}
          </div>`;

      $("#errorMessage").html(errorMessage);
    });

  // let email = document.getElementById('email').value;
  // let password = document.getElementById('password').value;

  // if (email === '' || password === '') return window.alert('Please enter all required fields');

  // firebase.auth().signInWithEmailAndPassword(email, password)
  //     .then((userCredential) => {
  //         // Signed in
  //         var user = userCredential.user;
  //         // ...

  //         db.collection('doctorCollection').doc(user.uid).get().then((result) => {
  //             if(result.data().isBlocked) return window.alert('You are not allowed to access this panal');
  //             localStorage.setItem('orgID', result.data().orgID);
  //             localStorage.setItem('docID', result.data().docID);
  //             window.location.href = '../dashboard.html'

  //         }).catch((err) => {
  //             window.alert(err.message);
  //         });

  //     })
  //     .catch((err) => {
  //         window.alert(err.message);

  //     });
}
