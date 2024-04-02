let file = null;

var fileButton = document.getElementById('articleFile');
fileButton.addEventListener('change', function (e) {

    file = e.target.files[0];

});

let articleType = "";
let patientID = "";
let organizationID = "";


function checkOrganization() {
    articleType = "ORGANIZATION";

    $('#articleTypeDD').html('For Organization')
    organizationID = orgID
}

function checkPatient() {
    articleType = "PATIENT";

    $('#patientDD').css('display', 'block')
    $('#articleTypeDD').html('For Patient')

}


db.collection('users').where('organizationID', '==', orgID).get().then((result) => {
    let i = 0;
    result.forEach((patient) => {


        $('#patientsList').append(`
        <a class="dropdown-item" id="patientData${i}" >${patient.data().name}</a>
        `);

        $(`#patientData${i}`).on('click', () => {
            patientID = patient.data().uid;

            $('#patientDropDown').html(patient.data().name)

        })

        i++;
    })
}).catch((err) => {
    window.alert(err.message)
});



function addArticle() {

    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let fileType = document.getElementById('fileType').value;


    if (title === "" || description === "" || fileType === "" || file === null) return window.alert('Please Fill All Fields')

    $('#subBtn').html('Please Wait...');
    $('#subBtn').addClass('disabled');

    var storageRef = firebase.storage().ref('images/ArticleImg' + Date.now());

    var uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            $('#progressBar').html(`Uploaded ${progress}%`);
            console.log('Upload is ' + progress + '% done');
            console.log(snapshot.state)
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // Handle unsuccessful uploads
            console.log(error)
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);

                let articleRef = db.collection("articleCollection").doc();

                let data = {
                    title,
                    description,
                    fileType: fileType.toUpperCase(),
                    patientID,
                    file: downloadURL,
                    docID: articleRef.id,
                    date: new Date(),
                    orgID: organizationID,
                    doctorID: doctorID

                }

                articleRef.set(data).then(() => {
                    window.alert('Article Added Successfully')
                    window.location.reload();
                }).catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    console.log(errorMessage);
                    window.alert(errorMessage)
                });
            })
        })


}