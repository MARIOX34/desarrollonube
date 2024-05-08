import {
  onAuthChanged,
  logOut,
  deleteCurrentUser,
  sendEmailToResetPassword,
  getData,
} from "./global.js";

const logoutBtn = document.getElementById("logout-btn");
const deleteAccountBtn = document.getElementById("delete-account-btn");
const resetPasswordBtn = document.getElementById("reset-password-btn");
const userData = document.getElementById("user-data");

document.addEventListener("DOMContentLoaded", () => {
  let currentUser;

  onAuthChanged((user) => {
    if (!user) {
      window.location.href = "../index.html";
    } else {
      currentUser = user;
      getData(user.uid).then((e) => {
          let data = e.data();
          userData.innerHTML = 
          `
            Cedula: ${data["cc"]} <p>
            Nombre: ${data["fullName"]}<p> 
            Direccion: ${data["address"]} <p>
            Telefono: ${data["phone"]} <p>
            Correo: ${data["email"]} <p>
            Fecha De Naciemiento: ${data["bornDate"]} <p>
          `
      }).catch((e)=> {
        window.location.href = "./reg.html";
      });;
    }
  });

  logoutBtn.addEventListener("click", logOut);
  deleteAccountBtn.addEventListener("click", deleteCurrentUser);
  resetPasswordBtn.addEventListener("click", () => {
    console.log(currentUser);
    sendEmailToResetPassword(currentUser.email).then(() => {
      alert("Se envio un correo para poder cambiar la contraseña");
    });
  });
});
