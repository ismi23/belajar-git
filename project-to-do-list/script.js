```javascript
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".task-filter button");

let tasks = [];
let currentFilter = "all";

function renderTasks() {
  taskList.innerHTML = "";

  taskCount.textContent = `${tasks.length} tugas`;

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-state";

    if (tasks.length === 0) {
      emptyMessage.textContent = "Belum ada tugas. Tambahkan tugas pertamamu!";
    } else {
      emptyMessage.textContent = "Tidak ada tugas pada kategori ini.";
    }

    taskList.appendChild(emptyMessage);
    return;
  }

  filteredTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = task.completed ? "task-item completed" : "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Tandai ${task.text} selesai`);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Hapus";

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
      renderTasks();
    });

    item.append(checkbox, text, deleteButton);
    taskList.appendChild(item);
  });
}

// Menambahkan tugas
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  taskInput.value = "";
  taskInput.focus();

  renderTasks();
});

// Mengatur tombol filter
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// Menampilkan tugas pertama kali
renderTasks();
```