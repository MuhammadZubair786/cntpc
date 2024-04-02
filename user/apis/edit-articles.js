let urlParam = new URLSearchParams(window.location.search);
let myParam = urlParam.get('id');



db.collection('articleCollection').doc(myParam).get().then((result) => {
    console.log(result.data());

    $('#title').val(result.data().title);
    $('#description').val(result.data().description);



    $('#articleDetails').append(`
    <div id="checkFile">

                    </div>
                    <h5 class="mt-5">${result.data().title}</h5>
                    <p>${result.data().description}</p>
    
    `)
    console.log(result.data().fileType);


    if (result.data().fileType === "IMAGE") {
        $('#checkFile').append(`
        
        <img src="${result.data().file}" width="100%" alt="">
        `)
    } else {
        $('#checkFile').append(`
        <video width="320" height="100%" controls>
            <source src="${result.data().file}">
            </video>
        `)
    }


}).catch((err) => {
    window.alert(err.message);

});


function editArticle() {
    let updatedTitle = $('#title').val();
    let updatedDescription = $('#description').val();

    if (updatedTitle === "" || updatedDescription === "") return window.alert("Please Fill All Fields");

    $('#subBtn').html('Please Wait...');
    $('#subBtn').addClass('disabled');
    db.collection('articleCollection').doc(myParam).update({ title: updatedTitle, description: updatedDescription }).then(() => {
        window.alert("Updated Successfully");
        window.location.reload();

    }).catch((err) => {
        window.alert(err.message);
    });

}


let file = null;

var fileButton = document.getElementById('articleFile');
fileButton.addEventListener('change', function (e) {

    file = e.target.files[0];

});

function editFile() {


    $('#subBtnEdit').html('Please Wait...');
    $('#subBtnEdit').addClass('disabled');

    let fileType = $('#fileType').val();
    if (file === null || fileType === "") return window.alert("Please Select File Or File Type");



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

                db.collection('articleCollection').doc(myParam).update(
                    {
                        file: downloadURL,
                        fileType: fileType
                    }
                ).then(() => {
                    window.alert("Updated Successfully");
                    window.location.reload();

                }).catch((err) => {
                    window.alert(err.message);
                });

            })
        })

}




function deleteFile(){
    let checkConfirm = confirm('Are you sure you want to delete this article');

    if (checkConfirm) {
        db.collection('articleCollection').doc(myParam).delete().then(() => {
            window.alert("Deleted Successfully");
            window.location.href = '../articles.html';
    
        }).catch((err) => {
            window.alert(err.message);
        });
    }
}