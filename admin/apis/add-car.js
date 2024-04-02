let userID = ""
let userName = ""


db.collection('users').orderBy('date', 'desc').get().then((result) => {
    let i = 0;
    result.forEach((item) => {
        let user = item.data()

        $('#usersData').append(`
        <a class="dropdown-item" id="selectUser${i}">${user.fname + ' ' + user.lname}</a>
        `)

        $(`#selectUser${i}`).on('click', () => {

            $('#usersDropDown').html(user.fname + ' ' + user.lname);

            userID = user.docID;
            userName = user.fname + ' ' + user.lname;

        })
        i++;
    })
}).catch((err) => {
    window.alert(err.message);
});



function addCar() {

    let name = document.getElementById('name').value;
    let licencePlate = document.getElementById('licencePlate').value;


    if (name === "" || licencePlate === "" || userID === "") {
        window.alert('Please Enter All Fields')
    } else {

        $('#subBtn').addClass('disabled');
        $('#subBtn').html('Please Wait...');
    
        let carRef = db.collection('cars').doc();

        let data = {
            name,
            licencePlate,
            docID: carRef.id,
            date: new Date(),
            userID,
            userName,
            isTransfered: false
        }

        carRef.set(data).then(() => {
            window.alert('Car added successfully');
            window.location.reload();

        }).catch((err) => {
            window.alert(err.message)
        });

    }
}