


db.collection('cars').orderBy('date', 'desc').get().then((result) => {
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

                                
                                <td class="align-middle text-center text-sm" id="checkUserStatus${i}">
                                
                                </td>
                                
                                <td class="align-middle">
                                <a href="/admin/edit-car.html?id=${user.docID}" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                                    Edit
                                </a>
                                </td>
                            </tr>
        `);


        if (user.isTransfered) {
            

            $(`#checkUserStatus${i}`).append(`
            <span class="badge badge-sm bg-danger">Transfered</span>
            `)
        }else{
            $(`#checkUserStatus${i}`).append(`
            <span class="badge badge-sm bg-success">Not Transfered</span>
            `)
        }

        i++;
    })
}).catch((err) => {
    window.alert(err.message);
});
