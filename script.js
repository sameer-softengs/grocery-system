const newItemInput = document.getElementById("new-item");
const addItemButton = document.getElementById("add-item");
const groceryList = document.getElementById("grocery-list");
const addToTableButton = document.getElementById("add-to-table");
const groceryTableBody = document.getElementById("grocery-table").querySelector("tbody");
const deleteSelectedButton = document.getElementById("delete-selected");
const clearTableButton = document.getElementById("clear-table");
const saveTableButton = document.getElementById("save-table");
const saveDateInput = document.getElementById("save-date");
const savedSection = document.getElementById("saved-section");
const savedTablesDiv = document.getElementById("saved-tables");

// Load saved data on page load
window.addEventListener("load", () => {
  loadSavedData();
});

// Add new item to the grocery list
addItemButton.addEventListener("click", () => {
  const newItem = newItemInput.value.trim();
  if (newItem) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<input type="checkbox" value="${newItem}"> ${newItem}`;
    groceryList.appendChild(listItem);
    newItemInput.value = "";
  }
});

// Add selected items to the table
addToTableButton.addEventListener("click", () => {
  const selectedItems = Array.from(groceryList.querySelectorAll("input[type='checkbox']:checked"));
  selectedItems.forEach((checkbox) => {
    addRowToTable(checkbox.value);
    checkbox.checked = false;
  });
});

// Add a row to the table
function addRowToTable(item) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="checkbox"></td>
    <td>${item}</td>
    <td><input type="text"></td>
  `;
  groceryTableBody.appendChild(row);
}

// Erase selected items from the table and the grocery list
deleteSelectedButton.addEventListener("click", () => {
  // Remove selected items from the table
  Array.from(groceryTableBody.querySelectorAll("input[type='checkbox']:checked")).forEach((checkbox) => {
    checkbox.closest("tr").remove();
  });

  // Remove selected items from the grocery list
  Array.from(groceryList.querySelectorAll("input[type='checkbox']:checked")).forEach((checkbox) => {
    checkbox.closest("li").remove();
  });
});

// Clear the entire table
clearTableButton.addEventListener("click", () => {
  groceryTableBody.innerHTML = "";
});

// Save the table
saveTableButton.addEventListener("click", () => {
  const date = saveDateInput.value;
  if (!date) {
    alert("Please enter a date.");
    return;
  }

  const rows = Array.from(groceryTableBody.querySelectorAll("tr"));
  if (rows.length === 0) {
    alert("The table is empty!");
    return;
  }

  const savedTableData = {
    date: date,
    items: rows.map((row) => {
      const item = row.cells[1].textContent;
      const quantity = row.cells[2].querySelector("input").value;
      return { item, quantity };
    }),
  };

  // Save the data to LocalStorage
  saveToLocalStorage(savedTableData);

  // Update the UI
  renderSavedTable(savedTableData);
  groceryTableBody.innerHTML = "";
});

// Save table data to LocalStorage
function saveToLocalStorage(savedTableData) {
  const savedTables = JSON.parse(localStorage.getItem("savedTables")) || [];
  savedTables.push(savedTableData);
  localStorage.setItem("savedTables", JSON.stringify(savedTables));
}

// Load saved data from LocalStorage
function loadSavedData() {
  const savedTables = JSON.parse(localStorage.getItem("savedTables")) || [];
  savedTables.forEach((tableData) => {
    renderSavedTable(tableData);
  });
}

// Render a saved table
function renderSavedTable(tableData) {
  const savedTableDiv = document.createElement("div");
  savedTableDiv.classList.add("saved-table");
  savedTableDiv.innerHTML = `
    <h4>Saved on: ${tableData.date}</h4>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${tableData.items
          .map(
            (item) =>
              `<tr>
                <td>${item.item}</td>
                <td>${item.quantity}</td>
              </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <button class="delete-saved-table">Delete Table</button>
    <button class="edit-saved-table">Edit Table</button>
  `;
  savedTablesDiv.appendChild(savedTableDiv);

  // Add delete functionality to the saved table
  savedTableDiv.querySelector(".delete-saved-table").addEventListener("click", () => {
    const savedTables = JSON.parse(localStorage.getItem("savedTables")) || [];
    const updatedTables = savedTables.filter(
      (table) => table.date !== tableData.date
    );
    localStorage.setItem("savedTables", JSON.stringify(updatedTables));
    savedTableDiv.remove();
  });

  // Add edit functionality to the saved table
  savedTableDiv.querySelector(".edit-saved-table").addEventListener("click", () => {
    tableData.items.forEach((item) => addRowToTable(item.item));
    const savedTables = JSON.parse(localStorage.getItem("savedTables")) || [];
    const updatedTables = savedTables.filter(
      (table) => table.date !== tableData.date
    );
    localStorage.setItem("savedTables", JSON.stringify(updatedTables));
    savedTableDiv.remove();
  });
}
