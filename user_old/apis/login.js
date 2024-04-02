

function login() {

    window.location.href = '/admin/dashboard.html'

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