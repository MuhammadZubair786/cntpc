db.collection('users').where('organizationID', '==', orgID).get().then((result) => {
    result.forEach((user) => {
        console.log(user.data());

        $('#patientsTable').append(`
        <tr>
                        <td>
                        <div class="d-flex px-2 py-1">
                            
                            <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${user.data().name}</h6>
                            
                            </div>
                        </div>
                        </td>
                        <td>
                        <p class="text-xs font-weight-bold mb-0">${user.data().email}</p>
                        </td>
                        
                        <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${user.data().gender}</span>
                        </td>
                        
                        <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${user.data().organizationName}</span>
                        </td>
                        
                        <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${user.data().dob}</span>
                        </td>
                        
                        <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${user.data().toAchieve}</span>
                        </td>



                        <td class="align-middle">
                        <a href="../edit-patient.html?id=${user.data().uid}" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                            Edit
                        </a>
                        </td>
                    </tr>
        `)
    })
}).catch((err) => {
    window.alert(err.message);
});