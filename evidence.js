const userForm = document.querySelector("#user-form");
const userTable = document.querySelector("#user-table");

const header = document.querySelector("header");
const buttonDelete = document.querySelector(".btn-delete");
const addressContainer = document.querySelector(".address-container");

const addressField = document.querySelector("#address");
const nameField = document.querySelector("#name");
const surnameField = document.querySelector("#surname");
const municipalityField = document.querySelector("#municipality");
const birthField = document.querySelector("#birth");
const genderField = document.querySelector("#gender");

//utils
function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
const clearForm = () => {
  nameField.value = "";
  surnameField.value = "";
  genderField.value = "M";
  birthField.value = "";
  addressField.value = "";
  municipalityField.value = "";
};
const showForm = () => {
  if (!localStorage.currentUUID) {
    buttonDelete.style.display = "none";
  }
  userForm.style.display = "block";
  userTable.style.display = "none";
};
const showTable = () => {
  userTable.style.display = "table";
  userForm.style.display = "none";
};
const dateStringFormat = (dateStr) => {
  const [y, m, d] = dateStr.split("-");
  return [d, m, y].join(".");
};
const sortBy = (key) => {
  return (a, b) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  };
};
const fetchAddr = async (term) => {
  const res = await fetch(
    `https://api.mapy.cz/suggest/?count=5&bounds=48.5370786%2C12.0921668%7C51.0746358%2C18.8927040&phrase=${term}`
  );
  const data = await res.json();
  return data.result;
};

addressField.addEventListener("input", async (e) => {
    municipalityField.value = ""
  const results = await fetchAddr(addressField.value);
  console.log(results);
  const suggestionList = document.createElement("ul");
  suggestionList.classList.add("suggestion-list");
  results.forEach((r) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const h4 = document.createElement("h4");
    const span = document.createElement("span");

    h4.innerText = r.userData.suggestFirstRow;
    span.innerText = r.userData.suggestSecondRow;

    div.appendChild(h4);
    div.appendChild(span);
    li.appendChild(div);

    li.addEventListener("click", (e) => {
      addressField.value = r.userData.suggestFirstRow;
      municipalityField.value = r.userData.municipality;
      suggestionList.style.display = "none";
    });

    suggestionList.appendChild(li);
  });
  if (!document.querySelector(".suggestion-list")) {
    document.querySelector(".address-container").appendChild(suggestionList);
  } else {
    document
      .querySelector(".address-container")
      .replaceChild(suggestionList, document.querySelector(".suggestion-list"));
  }
});

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
  const name = nameField.value.trim();
  const surname = surnameField.value.trim();
  const gender = genderField.value;
  const birth = birthField.value;

  const address = addressField.value.trim();
  const municipality = municipalityField.value;

  if (name == "") {
    nameField.value = "";
    nameField.focus();
    return;
  }
  if (surname == "") {
    surnameField.value = "";
    surnameField.focus();
    return;
  }
  if (municipality == "") {
    addressField.focus();
    return;
  }

  if (localStorage.getItem("currentUUID") === null) {
    const uuid = createUUID();
    const newUser = {
      uuid,
      name,
      surname,
      gender,
      birth,
      address,
      municipality,
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
        address,
        municipality,
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
    })
    .sort(sortBy("address"))
    .sort(sortBy("name"))
    .sort(sortBy("surname"));

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
    birthCell.innerText = dateStringFormat(u.birth);
    const addressCell = document.createElement("td");
    addressCell.innerText = u.address;
    const municipalityCell = document.createElement("td");
    municipalityCell.innerText = u.municipality;

    userElement.uuid = u.uuid;

    userElement.appendChild(surnameCell);
    userElement.appendChild(nameCell);
    userElement.appendChild(genderCell);
    userElement.appendChild(birthCell);
    userElement.appendChild(addressCell);
    userElement.appendChild(municipalityCell);

    return userElement;
  });

  userElements.forEach((el) => {
    userTable.children[1].appendChild(el);
  });
};

const editUser = (event) => {
  const clickedElement = event.target.parentElement; // select parent <tr> instead of clicked <td>
  const userObj = JSON.parse(localStorage.getItem(clickedElement.uuid));

  //set form fields to found user
  nameField.value = userObj.name;
  surnameField.value = userObj.surname;
  genderField.value = userObj.gender;
  birthField.value = userObj.birth;
  console.dir(birthField);
  addressField.value = userObj.address;
  municipalityField.value = userObj.municipality;


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
