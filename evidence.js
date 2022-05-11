const userForm = document.querySelector("#user-form");
const userTable = document.querySelector("#user-table");

const header = document.querySelector("header");
const buttonDelete = document.querySelector(".btn-delete");

//utils
function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
const clearForm = () => {
  document.querySelector("#name").value = "";
  document.querySelector("#surname").value = "";
  document.querySelector("#gender").value = "M";
  document.querySelector("#birth").value = "";
};
const showForm = () => {
    if(!localStorage.currentUUID) {
        buttonDelete.style.display = "none";
    }
  userForm.style.display = "block";
  userTable.style.display = "none";
};
const showTable = () => {
  userTable.style.display = "table";
  userForm.style.display = "none";
};

// "page" toggle
header.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "show-form":
      localStorage.removeItem("currentUUID");
      clearForm();
      showForm();
      break;
    case "show-table":
      showTable();
      fetchAndDisplayUsers();
      break;
  }
});

// form submit
userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.querySelector("#name").value;
  const surname = document.querySelector("#surname").value;
  const gender = document.querySelector("#gender").value;
  const birth = document.querySelector("#birth").value;

  if (localStorage.getItem("currentUUID") === null) {
    const uuid = createUUID();
    const newUser = {
      uuid,
      name,
      surname,
      gender,
      birth,
    };

    localStorage.setItem(uuid, JSON.stringify(newUser));
  } else {
    const currentUUID = localStorage.getItem("currentUUID");

    localStorage.setItem(
      currentUUID,
      JSON.stringify({
        uuid: currentUUID,
        name,
        surname,
        gender,
        birth,
      })
    );
  }

  // "redirect"

  showTable();
  localStorage.removeItem("currentUUID");
  clearForm();
  fetchAndDisplayUsers();
});

const fetchAndDisplayUsers = () => {
  const users = Object.keys(localStorage)
    .filter((key) => key !== "currentUUID")
    .map((k) => {
      return JSON.parse(localStorage.getItem(k));
    });

  //reset table on new fetch
  userTable.children[1].replaceChildren([]);

  const userElements = users.map((u) => {
    const userElement = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerText = u.name;
    const surnameCell = document.createElement("td");
    surnameCell.innerText = u.surname;
    const genderCell = document.createElement("td");
    genderCell.innerText = u.gender === "F" ? "Žena" : "Muž";
    const birthCell = document.createElement("td");
    birthCell.innerText = u.birth;

    userElement.uuid = u.uuid;

    userElement.appendChild(surnameCell);
    userElement.appendChild(nameCell);
    userElement.appendChild(genderCell);
    userElement.appendChild(birthCell);
    return userElement;
  });

  userElements.forEach((el) => {
    userTable.children[1].appendChild(el);
  });
};

const editUser = (event) => {
  const clickedElement = event.target.parentElement; // select parent <tr> instead of clicked <td>
  const userObj = JSON.parse(localStorage.getItem(clickedElement.uuid));

  const nameField = document.querySelector("#name");
  const surnameField = document.querySelector("#surname");
  const genderField = document.querySelector("#gender");
  const birthField = document.querySelector("#birth");

  //set form fields to found user
  nameField.value = userObj.name;
  surnameField.value = userObj.surname;
  genderField.value = userObj.gender;
  birthField.value = userObj.birth;

  //show delete btn
  buttonDelete.style.display = "block";

  localStorage.setItem("currentUUID", clickedElement.uuid);
  showForm();
};
userTable.addEventListener("click", (e) => {
  // prevent editUser firing on other table-related elements
  if (e.target.tagName === "TD") {
    editUser(e);
  }
});

const removeUser = () => {
  localStorage.removeItem(localStorage.getItem("currentUUID"));
};
buttonDelete.addEventListener("click", () => {
  removeUser();
  showTable();
  // todo - fetch data from localStorage
  fetchAndDisplayUsers();
});
