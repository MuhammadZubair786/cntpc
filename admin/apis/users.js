


db.collection('users').orderBy('date', 'desc').get().then((result) => {
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
                                <a href="/admin/edit-user.html?id=${user.docID}" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                                    Edit
                                </a>
                                </td>
                            </tr>
        `);


        if (user.isBlocked) {
            

            $(`#checkUserStatus${i}`).append(`
            <span class="badge badge-sm bg-danger">Blocked</span>
            `)
        }else{
            $(`#checkUserStatus${i}`).append(`
            <span class="badge badge-sm bg-success">Active</span>
            `)
        }

        i++;
    })
}).catch((err) => {
    window.alert(err.message);
});
