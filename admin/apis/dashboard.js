


db.collection('cars').get().then((result) => {
    $('#carsCount').html(result.docs.length);
}).catch((err) => {
    window.alert(err.message);
});



db.collection('drivers').get().then((result) => {
    $('#driversCount').html(result.docs.length);
}).catch((err) => {
    window.alert(err.message);
});


db.collection('transfers').get().then((result) => {
    $('#transfersCount').html(result.docs.length);
}).catch((err) => {
    window.alert(err.message);
});

db.collection('users').get().then((result) => {
    $('#usersCount').html(result.docs.length);
}).catch((err) => {
    window.alert(err.message);
});








db.collection('cars').limit(5).orderBy('date', 'desc').get().then((result) => {
    let i = 0;

    result.forEach((item) => {
        let user = item.data()

        $('#carsTable').append(`
        <tr>
                                <td>
                                <div class="d-flex px-2 py-1">
                                    
                                    <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-sm">${user.name}</h6>
                                    
                                    </div>
                                </div>
                                </td>

                                <td>
                                <p class="text-xs text-secondary mb-0">${user.licencePlate}</p>
                                </td>

                                <td>
                                <p class="text-xs text-secondary mb-0">${user.userName}</p>
                                </td>

                                
                                <td class="align-middle text-center text-sm" id="checkTransferStatus${i}">
                                
                                </td>
                                
                                <td class="align-middle">
                                <a href="javascript:;" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                                    Edit
                                </a>
                                </td>
                            </tr>
        `);


        if (user.isTransfered) {


            $(`#checkTransferStatus${i}`).append(`
            <span class="badge badge-sm bg-danger">Transfered</span>
            `)
        } else {
            $(`#checkTransferStatus${i}`).append(`
            <span class="badge badge-sm bg-success">Not Transfered</span>
            `)
        }

        i++;
    })
}).catch((err) => {
    window.alert(err.message);
});





db.collection('users').limit(5).orderBy('date', 'desc').get().then((result) => {
    let i = 0;

    result.forEach((item) => {
        let user = item.data()

        $('#usersTable').append(`
        <tr>
                                <td>
                                <div class="d-flex px-2 py-1">
                                    
                                    <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-sm">${user.fname}</h6>
                                    
                                    </div>
                                </div>
                                </td>

                                <td>
                                <p class="text-xs text-secondary mb-0">${user.lname}</p>
                                </td>

                                <td>
                                <p class="text-xs text-secondary mb-0">${user.email}</p>
                                </td>


                                <td>
                                <p class="text-xs text-secondary mb-0">${user.phoneNumber}</p>
                                </td>
                                
                                <td class="align-middle text-center text-sm" id="checkUserStatus${i}">
                                
                                </td>
                                
                                <td class="align-middle">
                                <a href="javascript:;" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                                    Edit
                                </a>
                                </td>
                            </tr>
        `);


        if (user.isBlocked) {


            $(`#checkUserStatus${i}`).append(`
            <span class="badge badge-sm bg-danger">Blocked</span>
            `)
        } else {
            $(`#checkUserStatus${i}`).append(`
            <span class="badge badge-sm bg-success">Active</span>
            `)
        }

        i++;
    })
}).catch((err) => {
    window.alert(err.message);
});



db.collection('transfers').limit(5).orderBy('date', 'desc').get().then((result) => {
    let i = 0;

    result.forEach((item) => {
        let transfer = item.data()

        $('#transferTable').append(`
        <tr>
                                <td>
                                <div class="d-flex px-2 py-1">
                                    
                                    <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-sm">${transfer.location1Name}</h6>
                                    
                                    </div>
                                </div>
                                </td>
                                <td>
                                <p class="text-xs text-secondary mb-0">${transfer.location2Name}</p>
                                </td>
                                <td>
                                <p class="text-xs text-secondary mb-0">${transfer.carName}</p>
                                </td>
                                
                                <td class="align-middle text-center text-sm" id="checktransferStatus${i}">
                                
                                </td>
                                
                                <td class="align-middle">
                                <a href="javascript:;" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                                    View Details
                                </a>
                                </td>
                            </tr>
        `);


        if (transfer.isTransfered) {


            $(`#checktransferStatus${i}`).append(`
            <span class="badge badge-sm bg-success">Transfered</span>
            `)
        } else {
            $(`#checktransferStatus${i}`).append(`
            <span class="badge badge-sm bg-danger">Pending</span>
            `)
        }

        i++;
    })
}).catch((err) => {
    window.alert(err.message);
});



