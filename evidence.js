const userForm = document.querySelector("#user-form");
const userTable = document.querySelector("#user-table");

const header = document.querySelector("header");

//utils
function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// "page" toggle
header.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "show-form":
      userForm.style.display = "block";
      userTable.style.display = "none";
      break;
    case "show-table":
      userTable.style.display = "block";
      userForm.style.display = "none";
      // todo - fetch data from localStorage
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
  const uuid = createUUID();
  console.log(name, surname, gender, birth, uuid);
  const newUser = {
    uuid,
    name,
    surname,
    gender,
    birth,
  };
  //in case of non-existing user key, parse empty JSON array
  localStorage.setItem(
    "users",
    JSON.stringify([
      ...JSON.parse(localStorage.getItem("users") || "[]"),
      newUser,
    ])
  );
  // "redirect"
  fetchAndDisplayUsers();
  userTable.style.display = "block";
  userForm.style.display = "none";
});

const fetchAndDisplayUsers = () => {
  const users = JSON.parse(localStorage.getItem("users"));
  console.log(users);

  //reset table on new fetch
  userTable.children[1].replaceChildren([]);

  const userElements = users.map((u) => {
    const userElement = document.createElement("tr");
    console.log(u);
    const nameCell = document.createElement("td");
    nameCell.innerText = u.name;
    const surnameCell = document.createElement("td");
    surnameCell.innerText = u.surname;
    const genderCell = document.createElement("td");
    genderCell.innerText = u.gender;
    const birthCell = document.createElement("td");
    birthCell.innerText = u.birth;

    userElement.uuid = u.uuid;

    userElement.appendChild(nameCell);
    userElement.appendChild(surnameCell);
    userElement.appendChild(genderCell);
    userElement.appendChild(birthCell);
    return userElement;
  });

  console.log(userElements);
  userElements.forEach((el) => {
    userTable.children[1].appendChild(el);
  });
};

const editUser = (event) => {
  const clickedElement = event.target.parentElement; // select parent <tr> instead of clicked <td>
  const userObj = JSON.parse(localStorage.getItem("users")).find(
    (u) => u.uuid === clickedElement.uuid
  );

  const nameField = document.querySelector("#name");
  const surnameField = document.querySelector("#surname");
  const genderField = document.querySelector("#gender");
  const birthField = document.querySelector("#birth");

  //set form fields to found user
  nameField.value = userObj.name;
  surnameField.value = userObj.surname;
  genderField.value = userObj.gender;
  birthField.value = userObj.birth;

  userForm.style.display = "block";
  userTable.style.display = "none";
};
userTable.addEventListener("click", editUser);
