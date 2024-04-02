let urlParam = new URLSearchParams(window.location.search);
let myParam = urlParam.get('id');



db.collection('transfers').doc(myParam).get().then((result) => {
    console.log(result.data());

    $('#transferDetails').append(`
    <h5>From: <strong id="location1"> ${result.data().location1Name}</strong></h5>
                    <h5>From: <strong id="location2"> ${result.data().location2Name}</strong></h5>

                    <p>Car: ${result.data().carName}</p>
    `)

}).catch((err) => {
    window.alert(err.message);
});



let driverName = ''
let driverID = ''

db.collection('drivers').get().then((result) => {
    let i = 0;
    result.forEach((driver) => {
        $('#driversList').append(`
        <a class="dropdown-item" id="selectDriver${i}">${driver.data().fname + ' ' + driver.data().lname}</a>
        `)

        $(`#selectDriver${i}`).on('click', () => {

            $('#driverListDD').html(driver.data().fname + ' ' + driver.data().lname);

            driverName = driver.data().fname + ' ' + driver.data().lname;

        })
        i++;
    })
}).catch((err) => {
    window.alert(err.message);
});