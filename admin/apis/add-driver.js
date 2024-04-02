


function addDriver() {

    let fname = document.getElementById('fname').value;
    let lname = document.getElementById('lname').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let phoneNumber = document.getElementById('phoneNumber').value;


    if (fname === "" || lname === "" || email === "" || password === "" || phoneNumber === "") return window, alert('Please Enter All Required Fields');

    $('#subBtn').addClass('disabled');
    $('#subBtn').html('Please Wait...');


    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // ...

            let userRef = db.collection('drivers').doc(user.uid);

            let data = {
                fname,
                lname,
                email,
                phoneNumber,
                docID: user.uid,
                date: new Date(),
                isBlocked: false,
                notificationID: "",
		type:"driver"

            }

            userRef.set(data).then(() => {
                window.alert('Driver added successfully');
                window.location.reload();
            }).catch((err) => {
                window.alert(err.message);
            });

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..

            window.alert(errorMessage)
        });
}
