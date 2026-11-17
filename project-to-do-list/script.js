```javascript
document.addEventListener("DOMContentLoaded", function () {

    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const taskCount = document.getElementById("task-count");

    const filterAll = document.getElementById("filter-all");
    const filterActive = document.getElementById("filter-active");
    const filterCompleted = document.getElementById("filter-completed");

    let tasks = [];
    let currentFilter = "all";

    // Mengatur tampilan tombol filter aktif
    function updateFilterButtons() {
        filterAll.classList.toggle("active", currentFilter === "all");
        filterActive.classList.toggle("active", currentFilter === "active");
        filterCompleted.classList.toggle("active", currentFilter === "completed");
    }

    // Menampilkan daftar tugas
    function renderTasks() {

        taskList.innerHTML = "";

        let filteredTasks = tasks;

        if (currentFilter === "active") {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        if (currentFilter === "completed") {
            filteredTasks = tasks.filter(task => task.completed);
        }

        taskCount.textContent = tasks.length + " tugas";

        if (filteredTasks.length === 0) {

            const emptyMessage = document.createElement("li");
            emptyMessage.className = "empty-state";

            if (tasks.length === 0) {
                emptyMessage.textContent = "Belum ada tugas. Tambahkan tugas pertamamu!";
            } else {
                emptyMessage.textContent = "Tidak ada tugas pada kategori ini.";
            }

            taskList.appendChild(emptyMessage);
            updateFilterButtons();
            return;
        }

        filteredTasks.forEach(task => {

            const item = document.createElement("li");

            item.className = task.completed
                ? "task-item completed"
                : "task-item";

            // Checkbox tugas
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", function () {
                task.completed = checkbox.checked;
                renderTasks();
            });

            // Teks tugas
            const text = document.createElement("span");
            text.textContent = task.text;

            // Tombol hapus
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Hapus";

            deleteButton.addEventListener("click", function () {

                tasks = tasks.filter(item => item.id !== task.id);

                renderTasks();
            });

            item.appendChild(checkbox);
            item.appendChild(text);
            item.appendChild(deleteButton);

            taskList.appendChild(item);

        });

        updateFilterButtons();
    }

    // Menambahkan tugas
    taskForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const text = taskInput.value.trim();

        if (text === "") return;

        tasks.push({
            id: Date.now(),
            text: text,
            completed: false
        });

        taskInput.value = "";
        taskInput.focus();

        renderTasks();
    });

    // Filter semua tugas
    filterAll.addEventListener("click", function () {
        currentFilter = "all";
        renderTasks();
    });

    // Filter tugas belum selesai
    filterActive.addEventListener("click", function () {
        currentFilter = "active";
        renderTasks();
    });

    // Filter tugas selesai
    filterCompleted.addEventListener("click", function () {
        currentFilter = "completed";
        renderTasks();
    });

    // Tampilan awal
    renderTasks();

});
```