document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskDeadline = document.getElementById("task-deadline");
    const taskPriority = document.getElementById("task-priority");
    const taskList = document.getElementById("task-list");
    const taskCount = document.getElementById("task-count");

    const filterAll = document.getElementById("filter-all");
    const filterActive = document.getElementById("filter-active");
    const filterCompleted = document.getElementById("filter-completed");

    // Mengambil data tugas dari Local Storage
    let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
    let currentFilter = "all";

    // Menyimpan data tugas ke Local Storage
    function saveTasks() {
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    }

    // Menampilkan tugas
    function renderTasks() {
        taskList.innerHTML = "";

        let filteredTasks = tasks;

        if (currentFilter === "active") {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === "completed") {
            filteredTasks = tasks.filter(task => task.completed);
        }

        taskCount.textContent = `${tasks.length} tugas`;

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <li class="empty-message">
                    Belum ada tugas.
                </li>
            `;
            return;
        }

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = "task-item";

            if (task.completed) {
                li.classList.add("completed");
            }

            const taskInfo = document.createElement("div");
            taskInfo.className = "task-info";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            const taskText = document.createElement("span");
            taskText.className = "task-text";
            taskText.textContent = task.text;

            const deadline = document.createElement("span");
            deadline.className = "deadline-text";
            deadline.textContent = task.deadline
                ? `Deadline: ${task.deadline}`
                : "Tanpa deadline";

            const priority = document.createElement("span");
            priority.className = "priority-text";
            priority.textContent = `Prioritas: ${task.priority}`;

            taskInfo.append(checkbox, taskText, deadline, priority);

            const buttonContainer = document.createElement("div");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-button";

            editButton.addEventListener("click", () => {
                const newText = prompt("Edit tugas:", task.text);

                if (newText !== null && newText.trim() !== "") {
                    task.text = newText.trim();
                    saveTasks();
                    renderTasks();
                }
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Hapus";
            deleteButton.className = "delete-button";

            deleteButton.addEventListener("click", () => {
                if (confirm("Yakin ingin menghapus tugas ini?")) {
                    tasks = tasks.filter(item => item.id !== task.id);
                    saveTasks();
                    renderTasks();
                }
            });

            buttonContainer.append(editButton, deleteButton);
            li.append(taskInfo, buttonContainer);
            taskList.appendChild(li);
        });
    }

    // Menambahkan tugas baru
    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const text = taskInput.value.trim();

        if (text === "") {
            alert("Nama tugas tidak boleh kosong!");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: text,
            deadline: taskDeadline.value,
            priority: taskPriority.value,
            completed: false
        };

        tasks.push(newTask);

        saveTasks();
        renderTasks();

        taskForm.reset();
    });

    // Filter semua tugas
    filterAll.addEventListener("click", () => {
        currentFilter = "all";
        setActiveFilter(filterAll);
        renderTasks();
    });

    // Filter tugas aktif
    filterActive.addEventListener("click", () => {
        currentFilter = "active";
        setActiveFilter(filterActive);
        renderTasks();
    });

    // Filter tugas selesai
    filterCompleted.addEventListener("click", () => {
        currentFilter = "completed";
        setActiveFilter(filterCompleted);
        renderTasks();
    });

    // Mengatur tombol filter aktif
    function setActiveFilter(activeButton) {
        [filterAll, filterActive, filterCompleted].forEach(button => {
            button.classList.remove("active");
        });

        activeButton.classList.add("active");
    }

    // Menampilkan tugas saat halaman dibuka
    renderTasks();
});