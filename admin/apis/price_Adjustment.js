db.collection("Price_Adjusment")
    .get()
    .then((result) => {
        var i = 1;
        console.log("test")
        result.forEach((item) => {
            let price = item.data();
            console.log(price.Price_Id)
            $("#pricelTable").append(`
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
                                    price.Km
                                }</p>
                                </td>

                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                 price.Price
                                }€/Km</p>
                                </td>
                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                    price.Price_Id
                                   }</p>
                                   </td>
                           
                                
                                

                                
                            </tr>
        `);

            i++;

        })
    })