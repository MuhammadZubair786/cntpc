function logout() {
  localStorage.removeItem("userDetail");
  window.location.href = "./../index.html";
}
