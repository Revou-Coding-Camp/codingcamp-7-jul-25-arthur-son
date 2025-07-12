document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addBtn");
  const deleteAllBtn = document.getElementById("deleteAllBtn");
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const todoTableBody = document.getElementById("todoTableBody");
  const notification = document.getElementById("notification");
  const filterToggleBtn = document.getElementById("filterToggleBtn");
  const filterDropdown = document.getElementById("filterDropdown");

  let editingRow = null;

  function showNotification(message, color = "bg-green-500") {
    notification.textContent = message;
    notification.className = `mb-4 px-4 py-2 rounded text-sm font-medium text-black ${color}`;
    notification.classList.remove("hidden");
    setTimeout(() => notification.classList.add("hidden"), 2500);
  }

  function resetForm() {
    taskInput.value = "";
    dateInput.value = "";
    editingRow = null;
    addBtn.innerHTML = "+";
    addBtn.classList.remove("bg-green-400");
    addBtn.classList.add("bg-indigo-400");
  }

  addBtn.addEventListener("click", () => {
    const task = taskInput.value.trim();
    const date = dateInput.value;
    if (!task || !date) return showNotification("Task dan tanggal harus diisi!", "bg-red-500");

    if (editingRow) {
      editingRow.querySelector(".task-text").textContent = task;
      editingRow.querySelector(".task-date").textContent = date;
      showNotification("ToDo berhasil diubah!");
      resetForm();
    } else {
      const tr = document.createElement("tr");
      tr.className = "border-t border-gray-700";
      tr.setAttribute("data-status", "Pending");
      tr.innerHTML = `
        <td class="p-3 task-text">${task}</td>
        <td class="p-3 task-date">${date}</td>
        <td class="p-3 status">Pending</td>
        <td class="p-3 space-x-2">
          <button class="bg-yellow-400 text-black px-2 py-1 rounded edit-btn">✏️</button>
          <button class="bg-green-500 text-black px-2 py-1 rounded toggle-status-btn">✅</button>
          <button class="bg-pink-500 text-black px-2 py-1 rounded delete-btn">🗑️</button>
        </td>
      `;
      todoTableBody.appendChild(tr);
      showNotification("ToDo berhasil ditambahkan!");
      resetForm();
    }
  });

  todoTableBody.addEventListener("click", (e) => {
    const target = e.target;
    const row = target.closest("tr");

    if (target.classList.contains("delete-btn")) {
      row.remove();
      showNotification("ToDo berhasil dihapus!", "bg-red-500");
    }

    if (target.classList.contains("toggle-status-btn")) {
      const statusCell = row.querySelector(".status");
      const newStatus = statusCell.textContent === "Pending" ? "Selesai" : "Pending";
      statusCell.textContent = newStatus;
      row.setAttribute("data-status", newStatus);
      showNotification(`Status diubah menjadi ${newStatus}`);
    }

    if (target.classList.contains("edit-btn")) {
      taskInput.value = row.querySelector(".task-text").textContent;
      dateInput.value = row.querySelector(".task-date").textContent;
      editingRow = row;
      addBtn.innerHTML = "✔️";
      addBtn.classList.remove("bg-indigo-400");
      addBtn.classList.add("bg-green-400");
    }
  });

  deleteAllBtn.addEventListener("click", () => {
    todoTableBody.innerHTML = "";
    showNotification("Semua ToDo berhasil dihapus!", "bg-red-500");
  });

  filterDropdown.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      const filter = e.target.getAttribute("data-filter");
      const rows = todoTableBody.querySelectorAll("tr");
      rows.forEach(row => {
        const status = row.getAttribute("data-status");
        row.classList.toggle("hidden", filter !== "Semua" && status !== filter);
      });
      filterDropdown.classList.add("hidden");
      showNotification(`Filter diterapkan: ${filter}`, "bg-yellow-500");
    }
  });

  // Toggle dropdown filter saat tombol filter diklik
filterToggleBtn.addEventListener("click", () => {
  filterDropdown.classList.toggle("hidden");
});


  // Close filter dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!filterDropdown.contains(e.target) && !filterToggleBtn.contains(e.target)) {
      filterDropdown.classList.add("hidden");
    }
  });
});
