const evidenceForm = document.querySelector("#evidence-form");
const evidenceTable = document.querySelector("#evidence-table");

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
      evidenceForm.style.display = "block";
      evidenceTable.style.display = "none";
      break;
    case "show-table":
      evidenceTable.style.display = "block";
      evidenceForm.style.display = "none";
      // todo - fetch data from localStorage
      break;
  }
});

// form submit
evidenceForm.addEventListener("submit", (e) => {
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
  localStorage.setItem("users",
  JSON.stringify([...JSON.parse(localStorage.getItem("users") || "[]"), newUser])
  )
  // "redirect"
  evidenceTable.style.display = "block";
  evidenceForm.style.display = "none";
});

//fetch users from localStorage
localStorage.ge;
