function login() {
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
      console.log({ user }, user.uid);

      var isAdmin = true;

      const checkInUser = await db.collection("users").doc(user.uid).get();

      if (checkInUser.exists) {
        let errorMessage = `
                 <div class="bg-danger w-100 my-4 mb-2 py-2 text-light">
                   INVALID_LOGIN_CREDENTIALS
                 </div>`;

        $("#errorMessage").html(errorMessage);
        return false;
      } else {
        console.log("Checked 1");
      }

      const checkInDriver = await db.collection("drivers").doc(user.uid).get();
      if (checkInDriver.exists) {
        let errorMessage = `
                 <div class="bg-danger w-100 my-4 mb-2 py-2 text-light">
                   INVALID_LOGIN_CREDENTIALS
                 </div>`;

        $("#errorMessage").html(errorMessage);
        return false;
      }

      localStorage.setItem("userDetail", JSON.stringify(userCredential.user));
      window.location.href = routeToNext;

      // db.collection("users")
      //   .doc(user.uid)
      //   .get()
      //   .then(function (doc) {
      //     if (doc.exists) {
      //       isAdmin = false;
      //       // Document exists, access the data using doc.data()
      //       let errorMessage = `
      //           <div class="bg-danger w-100 my-4 mb-2 py-2 text-light">
      //             Admin credentials are not correct.
      //           </div>`;

      //       $("#errorMessage").html(errorMessage);

      //       return false;
      //     } else {
      //       // Document does not exist
      //       console.log("No such document!");
      //     }
      //   })
      //   .catch(function (err) {
      //     console.log("Error getting document:", err);
      //     console.log(err.message);
      //     let errorItem = JSON.parse(err.message);
      //     let errorMessage = `
      //       <div class="bg-danger w-100 my-4 mb-2 py-2 text-light">
      //         ${errorItem?.error?.message}
      //       </div>`;

      //     $("#errorMessage").html(errorMessage);
      //   });

      // db.collection("drivers")
      //   .doc(user.uid)
      //   .get()
      //   .then(function (doc) {
      //     if (doc.exists) {
      //       isAdmin = false;
      //       // Document exists, access the data using doc.data()
      //       console.log("Document data Drivers:", doc.data());
      //       let errorMessage = `
      //           <div class="bg-danger w-100 my-4 mb-2 py-2 text-light">
      //             Admin credentials are not correct.
      //           </div>`;

      //       $("#errorMessage").html(errorMessage);

      //       return false;
      //     } else {
      //       // Document does not exist
      //       console.log("No such document! Drivers");
      //     }
      //   })
      //   .catch(function (err) {
      //     console.log("Error getting document:", err);

      //     console.log(err.message);
      //     let errorItem = JSON.parse(err.message);
      //     let errorMessage = `
      //     <div class="bg-danger w-100 my-4 mb-2 py-2 text-light">
      //         ${errorItem?.error?.message}
      //       </div>`;

      //     $("#errorMessage").html(errorMessage);
      //   });

      // Next part

      // const checkUser = await db.collection("users")
      //   .where("docID", "==",  user.uid)
      //   .get()

      //   console.log({checkUser} ,checkUser?);
      // .then((result) => {
      //   // if (userCredential.user) {
      //   //   localStorage.setItem(
      //   //     "userDetail",
      //   //     JSON.stringify(userCredential.user)
      //   //   );
      //   //   window.location.href = routeToNext;
      //   // }
      //   console.log({ result });
      // }) .catch((err) => {
      //   console.log(JSON.parse(err.message) , {err});

      // });;
    })
    .catch((err) => {
      console.log(err.message);
      let errorItem = JSON.parse(err.message);
      let errorMessage = `
      <div class="bg-danger w-100 my-4 mb-2 py-2 text-light">
          ${errorItem?.error?.message}
        </div>`;

      $("#errorMessage").html(errorMessage);
    });
}
