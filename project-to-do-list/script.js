document.addEventListener("DOMContentLoaded", function () {

    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskDeadline = document.getElementById("task-deadline");
    const taskPriority = document.getElementById("task-priority");
    const taskList = document.getElementById("task-list");
    const taskCount = document.getElementById("task-count");

    const filterAll = document.getElementById("filter-all");
    const filterActive = document.getElementById("filter-active");
    const filterCompleted = document.getElementById("filter-completed");

    let tasks = [];
    let currentFilter = "all";

    function renderTasks() {
        taskList.innerHTML = "";

        taskCount.textContent = `${tasks.length} tugas`;

        const filteredTasks = tasks.filter(function (task) {
            if (currentFilter === "active") {
                return !task.completed;
            }

            if (currentFilter === "completed") {
                return task.completed;
            }

            return true;
        });

        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.className = "empty-state";

            emptyMessage.textContent = tasks.length === 0
                ? "Belum ada tugas. Tambahkan tugas pertamamu!"
                : "Tidak ada tugas pada kategori ini.";

            taskList.appendChild(emptyMessage);
        }

        filteredTasks.forEach(function (task) {

            const item = document.createElement("li");

            item.className = task.completed
                ? "task-item completed"
                : "task-item";

            // Checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", function () {
                task.completed = checkbox.checked;
                renderTasks();
            });

            // Nama tugas
            const text = document.createElement("span");
            text.textContent = task.text;

            // Informasi deadline
            const deadlineText = document.createElement("small");
            deadlineText.className = "deadline-text";
            deadlineText.textContent = "Deadline: " + task.deadline;

            // Prioritas
            const priorityText = document.createElement("small");
            priorityText.className =
                "priority-text " + task.priority.toLowerCase();

            priorityText.textContent = task.priority;

            // Tombol Edit
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "edit-button";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function () {
                const newText = prompt("Ubah nama tugas:", task.text);

                if (newText === null) return;

                if (newText.trim() === "") {
                    alert("Nama tugas tidak boleh kosong!");
                    return;
                }

                task.text = newText.trim();
                renderTasks();
            });

            // Tombol Hapus
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Hapus";

            deleteButton.addEventListener("click", function () {
                const confirmation = confirm(
                    "Apakah kamu yakin ingin menghapus tugas ini?"
                );

                if (confirmation) {
                    tasks = tasks.filter(function (currentTask) {
                        return currentTask.id !== task.id;
                    });

                    renderTasks();
                }
            });

            item.appendChild(checkbox);
            item.appendChild(text);
            item.appendChild(deadlineText);
            item.appendChild(priorityText);
            item.appendChild(editButton);
            item.appendChild(deleteButton);

            taskList.appendChild(item);
        });

        filterAll.classList.toggle("active", currentFilter === "all");
        filterActive.classList.toggle("active", currentFilter === "active");
        filterCompleted.classList.toggle("active", currentFilter === "completed");
    }

    // Tambah tugas
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const text = taskInput.value.trim();

        if (text === "") return;

        tasks.push({
            id: Date.now(),
            text: text,
            deadline: taskDeadline.value,
            priority: taskPriority.value,
            completed: false
        });

        taskInput.value = "";
        taskDeadline.value = "";
        taskPriority.value = "Sedang";

        taskInput.focus();

        renderTasks();
    });

    // Filter semua
    filterAll.addEventListener("click", function () {
        currentFilter = "all";
        renderTasks();
    });

    // Filter belum selesai
    filterActive.addEventListener("click", function () {
        currentFilter = "active";
        renderTasks();
    });

    // Filter selesai
    filterCompleted.addEventListener("click", function () {
        currentFilter = "completed";
        renderTasks();
    });

    renderTasks();

});