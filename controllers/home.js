import {
  onAuthChanged,
  logOut,
  deleteCurrentUser,
  sendEmailToResetPassword,
  getData,
  getDataAsAdmin,
  deleteDocument,
  updateData,
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
            const saveDataBtn = document.getElementById("save-data-btn");
            const userName = document.getElementById("name-text");
            const cc = document.getElementById("cc-text");
            const address = document.getElementById("address-text");
            const phone = document.getElementById("phone-text");
            const email = document.getElementById("email-text");
            const bornDate = document.getElementById("born-date-text");
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
                  <td><button type="button" class="delete-btn" data-id="${docData["id"]}"">Eliminar</button><button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="${docData["id"]}">Actualizar</button></td>
                </tr>`;
              });
              tableHTML += `</table>`;
              content.innerHTML += tableHTML;
            });
            const exampleModal = document.getElementById("exampleModal");
            if (exampleModal) {
              exampleModal.addEventListener("show.bs.modal", async (event) => {
                const button = event.relatedTarget;
                const userId = button.getAttribute("data-bs-whatever");
                const modalTitle = exampleModal.querySelector(".modal-title");
                const modalBodyInput =
                  exampleModal.querySelector(".modal-body input");
                await getData(userId).then((d) => {
                  const userD = d.data();
                  userName.value = userD.fullName;
                  cc.value = userD.cc;
                  address.value = userD.address;
                  phone.value = userD.phone;
                  email.value = userD.email;
                  bornDate.value = userD.bornDate;
                  modalTitle.textContent = `Editar a ${userName.value}`;

                  saveDataBtn.addEventListener("click", async () => {
                    await updateData(
                      userId,
                      userD.rol,
                      cc.value,
                      userName.value,
                      address.value,
                      phone.value,
                      email.value,
                      bornDate.value
                    ).then(() => {
                      alert("Se actualizaron los datos");
                      window.location.reload();
                    });
                  });
                });
              });
            }
          }
        })
        .catch((e) => {
          //window.location.href = "./reg.html";
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
