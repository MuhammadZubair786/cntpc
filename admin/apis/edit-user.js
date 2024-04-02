let urlParam = new URLSearchParams(window.location.search);
let myParam = urlParam.get('id');


console.log(myParam);


let checkBlock;

db.collection('users').doc(myParam).get().then((result) => {

    $('#fname').val(result.data().fname);
    $('#lname').val(result.data().lname);
    $('#phoneNumber').val(result.data().phoneNumber);



    if (result.data().isBlocked) {
        $('#blockUser').html('Unblock The User')
    } else {
        $('#blockUser').html('Block The User')

    }

    checkBlock = result.data().isBlocked

}).catch((err) => {
    window.alert(err.message)
});


function editUser() {

    let updatedFName = $('#fname').val();
    let updatedLName = $('#lname').val();
    let updatedPhoneNumber = $('#phoneNumber').val();

    if (updatedFName === "" || updatedLName === "" || updatedPhoneNumber === "") {
        window.alert('Please Enter All Fields')
    } else {

        $('#subBtn').html('Please Wait...');
        $('#subBtn').addClass('disabled');


        db.collection('users').doc(myParam).update({
            fname: updatedFName,
            lname: updatedLName,
            phoneNumber: updatedPhoneNumber
        }).then(() => {
            window.alert('Updated Successfully');
            window.location.reload();
        }).catch((err) => {
            window.alert(err.message)
        });

    }

}


function blockUserFunction() {


    db.collection('users').doc(myParam).update({
        isBlocked: !checkBlock
    }).then(() => {
        window.alert('Updated Successfully');
        window.location.reload();
    }).catch((err) => {
        window.alert(err.message)
    });


}