let urlParam = new URLSearchParams(window.location.search);
let myParam = urlParam.get('id');


console.log(myParam);



db.collection('cars').doc(myParam).get().then((result) => {

    console.log(result.data());


    $('#name').val(result.data().name);
    $('#licencePlate').val(result.data().licencePlate);

}).catch((err) => {
    window.alert(err.message);
});



function editCar() {

    let updatedName = $('#name').val();
    let updatedLicencePlate = $('#licencePlate').val();

    if (updatedName === "" || updatedLicencePlate === "") {
        window.alert("Please enter all required fields")
    } else {



        $('#subBtn').html('Please Wait...');
        $('#subBtn').addClass('disabled');



        db.collection('cars').doc(myParam).update({
            name: updatedName,
            licencePlate: updatedLicencePlate
        }).then(() => {
            window.alert("Successfully Updated");
            window.location.reload();
        }).catch((err) => {
            window.alert(err.message);
        });
    }

}




function deleteCar() {
    let checkConfirm = confirm('Are you sure you want to delete this car?');

    if (checkConfirm) {
        db.collection('cars').doc(myParam).delete().then(() => {
            window.alert("Successfully Deleted");
            window.location.href = '../cars.html'
        }).catch((err) => {
            window.alert(err.message);
        });
    } else {

    }
}