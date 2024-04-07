let plan_id =""
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
                                 plan.Above
                                }</p>
                                </td>
                                <td>
                                <p class="text-xs text-secondary mb-0">${
                                 plan.Below
                                }</p>
                                </td>
                                <td>
                                            <button class="btn btn-success text-light text-xs  mb-0" id=${plan.planId} onClick=UpdatePlan(this) >Update</button>
                                      </td>
                               
                              
                                
                                

                                
                            </tr>
        `);

            i++;

        })
    })
async function UpdatePlan(e){
    console.log(e.id)
    plan_id = e.id

    try {
        const docRef = db.collection("Plans").doc(e.id);
        const doc = await docRef.get();
    
        if (doc.exists) {
            // Document exists, access its data
            const documentData = doc.data();
            console.log(documentData);
            document.getElementById("plan_name").innerText="Plan Name  : " + documentData.Plan +" "
            document.getElementById("plan_above").value=documentData.Above
            document.getElementById("plan_below").value=documentData.Below
        } else {
            // The collection is empty
            console.log("No documents found in the collection.");
        }
    } catch (error) {
        console.error("Error getting documents: ", error);
    }

    $("#UpdatePlan").modal("show");
   

}

async function UpdateNewPlan(e){

  console.log(e.id)
  try {
    const docRef = db.collection("Plans").doc(plan_id);
    const doc = await docRef.get();

    if (doc.exists) {
        // Document exists, access its data
        const documentData = doc.data();
        console.log(documentData);
    //   document.getElementById("plan_name").innerText=documentData.Plan
       var inp1 =  document.getElementById("plan_above").value
        var inp2 = document.getElementById("plan_below").value
        if(inp1=="" || inp1.length==0 ||inp2=="" || inp2.length==0){
            alert("Please Enter All Data ")

        }
        else{
            var obj ={
                Above : inp1,
                Below:inp2
            }
            await docRef.update(obj)
            $("#UpdatePlan").modal("hide");
            alert("Update Plan Price Successfully")
            window.location.reload()
        }

     
    } else {
        // The collection is empty
        console.log("No documents found in the collection.");
    }
} catch (error) {
    console.error("Error getting documents: ", error);
}


}

$(document).on("click", "#closeplan", function () {
    $("#UpdatePlan").modal("hide");
  });