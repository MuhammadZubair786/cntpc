db.collection("Plans")
    .get()
    .then((result) => {
        var i = 1;

        result.forEach((item) => {
            let plan = item.data();

            $("#planTable").append(`
        <tr>
                                <td>
                                <div class="d-flex px-2 py-1">
                                    
                                    <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-sm">${
                                      i
                                    }</h6>
                                    
                                    </div>
                                </div>
                                </td>
                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                    plan.planId
                                }</p>
                                </td>

                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                    plan.Plan
                                }</p>
                                </td>

                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                 plan.Plan_Multipler
                                }</p>
                                </td>
                                <td class='text-center'>
                                <button class='btn btn-success'>
                                Update</button>
                                
                                </td>
                              
                                
                                

                                
                            </tr>
        `);

            i++;

        })
    })