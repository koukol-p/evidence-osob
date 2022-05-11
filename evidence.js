const evidenceForm = document.querySelector("#evidence-form");
const evidenceTable = document.querySelector("#evidence-table");

const showFormButton = document.querySelector("#show-form");
const showTableButton = document.querySelector("#show-table");
const header = document.querySelector("header");

header.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "show-form":
      evidenceForm.style.display = "block";
      evidenceTable.style.display = "none";
      break;
    case "show-table":
      evidenceTable.style.display = "block";
      evidenceForm.style.display = "none";
      break;
  }
});
