import {
  onAuthChanged,
  logOut,
  deleteCurrentUser,
  sendEmailToResetPassword,
  getData,
  getDataAsAdmin,
  deleteDocument,
} from "./global.js";

const logoutBtn = document.getElementById("logout-btn");
const deleteAccountBtn = document.getElementById("delete-account-btn");
const createAccountBtn = document.getElementById("create-account-btn");
const resetPasswordBtn = document.getElementById("reset-password-btn");
const userData = document.getElementById("user-data");
const content = document.getElementById("content");

document.addEventListener("DOMContentLoaded", () => {
  let currentUser;

  function deleteUser(id) {
    deleteDocument(id).then(()=> {
      const rowToRemove = content.querySelector(`[data-id="${id}"]`).closest("tr");
      rowToRemove.remove();
    });
  }

  onAuthChanged((user) => {
    if (!user) {
      window.location.href = "../index.html";
    } else {
      currentUser = user;
      getData(user.uid)
        .then((e) => {
          let data = e.data();
          let rol = data["rol"];
          userData.innerHTML = `
            Cedula: ${data["cc"]} <p>
            Nombre: ${data["fullName"]}<p> 
            Rol: ${data["rol"]}<p> 
            Direccion: ${data["address"]} <p>
            Telefono: ${data["phone"]} <p>
            Correo: ${data["email"]} <p>
            Fecha De Naciemiento: ${data["bornDate"]} <p>
          `;
          if (rol === "admin") {
            userData.innerHTML += `<button type="button" id="create-account-btn">Crear Usuario</button>`;
            getDataAsAdmin().then((userData) => {
              let tableHTML = `
              <table>
                <tr>
                  <th>Nombre</th>
                  <th>Cedula</th>
                  <th>Celular</th>
                  <th>Rol</th>
                  <th></th>
                </tr>
            `;
              userData.forEach((doc) => {
                let docData = doc.data();
                console.log(docData);
                tableHTML += `
                <tr>
                  <td>${docData["fullName"]}</td>
                  <td>${docData["cc"]}</td>
                  <td>${docData["phone"]}</td>
                  <td>${docData["rol"]}</td>
                  <td><button type="button" class="delete-btn" data-id="${docData["id"]}"">Eliminar</button></td>
                </tr>`;
              });
              tableHTML += `</table>`;
              content.innerHTML += tableHTML;
            });
          }
        })
        .catch((e) => {
          window.location.href = "./reg.html";
        });
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
  createAccountBtn.addEventListener('click', ()=> {
    window.location.href = "/templates/reg.html";
  })
  content.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      deleteUser(id);
    }
  });
});
