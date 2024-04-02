db.collection("cars")
  .where("userID", "==", JSON.parse(localStorage.getItem("userDetailRide")).uid)
  .get()
  .then((result) => {
    let i = 0;
    console.log(result.size);
    result.forEach((item) => {
      let cars = item.data();
      $("#coursesTable").append(`
      <tr>
      <td>
        <div class="d-flex px-2 py-1">
          <div
            class="d-flex flex-column justify-content-center"
          >
            <h6 class="mb-0 text-sm">${cars?.name}</h6>
          </div>
        </div>
      </td>
      <td>
        <p class="text-xs text-secondary mb-0">
        ${cars?.licencePlate}
        </p>
      </td>
      </tr>
        `);

      i++;
    });
  })
  .catch((err) => {
    window.alert(err.message);
  });
