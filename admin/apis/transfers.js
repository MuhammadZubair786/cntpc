
db.collection('transfers').where('isTransfered', '==', false).get().then((result) => {
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
                                <a href="/admin/assign-driver.html?id=${transfer.docID}" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                                    Assign
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
