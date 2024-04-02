db.collection('articleCollection').where('doctorID', '==', doctorID).get().then((result) => {

    result.forEach((article) => {
        

        $('#articleTable').append(`
        <tr>
                        <td>
                        <div class="d-flex px-2 py-1">
                            
                            <div class="d-flex flex-row gap-2 justify-content-center">
                            <h6 class="mb-0 text-sm">${article.data().title}</h6>
                            
                            </div>
                        </div>
                        </td>
                        <td>
                        <p class="text-xs text-secondary mb-0">${article.data().description.slice(0,50)}...</p>
                        </td>
                        
                        <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${article.data().date.toDate().toString().slice(0,15)}</span>
                        </td>
                        <td class="align-middle">
                        <a href="../edit-article.html?id=${article.data().docID}" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit Article">
                            Edit
                        </a>
                        </td>
                    </tr>
        `)
    })
}).catch((err) => {
    window.alert(err.message);
});