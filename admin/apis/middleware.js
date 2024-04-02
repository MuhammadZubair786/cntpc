document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("userDetail")) {
    window.location.href = "./../index.html"; // Replace with your login page URL
  }
});
