let urlParam = new URLSearchParams(window.location.search);
let myParam = urlParam.get('id');




db.collection('users').doc(myParam).get().then((result) => {

    $('#patientDetails').append(`
                    <h5>${result.data().name}</h5>
                    <p>${result.data().email}</p>
                    <p>Organization: <span id="checkOrganization"> </span></p>
                    <p>Date of birth: ${result.data().dob}</p>
                    <p>Gender: ${result.data().gender}</p>
                    <p>Cure for: ${result.data().toAchieve}</p>
                    

`);


    if (result.data().organizationName === '') {
        $('#checkOrganization').html(`No Organization`)
    } else {
        $('#checkOrganization').html(result.data().organizationName)

    }

}).catch((error) => {
    window.alert(error.message);
})




db.collection('med').doc(myParam).collection('medicines').get().then((result) => {
    if (result.docs.length <= 0) {
        $('#medTable').html(`<h6 class="m-5"> No Data Found</h6>`)
    }
    result.forEach((item) => {
        console.log(item.data());

        $('#medTable').append(`
        <tr stlye="text-align: center !important">
                            <td>
                            <div class="d-flex px-2 py-1">
                                
                                <div class="d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm">${item.data().medName}</h6>
                                
                                </div>
                            </div>
                            </td>
                            <td>
                            <p class="text-xs font-weight-bold mb-0">${item.data().pill}</p>
                            </td>
                            <td>
                            <p class="text-xs font-weight-bold mb-0">${item.data().startDate}</p>
                            </td>
                            <td>
                            <p class="text-xs font-weight-bold mb-0">${item.data().endDate}</p>
                            </td>
                            <td>
                            <p class="text-xs font-weight-bold mb-0">${item.data().takeTime}</p>
                            </td>
                            <td>
                            <p class="text-xs font-weight-bold mb-0">${item.data().howOften}</p>
                            </td>

                        </tr>
        `)

    })
}).catch((err) => {
    window.alert(err.message);
});