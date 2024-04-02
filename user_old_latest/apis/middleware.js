document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("userDetailRide")) {
    window.location.href = "./index.html"; // Replace with your login page URL
  }
});
