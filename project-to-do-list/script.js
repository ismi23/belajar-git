document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskDeadline = document.getElementById("task-deadline");
    const taskPriority = document.getElementById("task-priority");
    const taskList = document.getElementById("task-list");
    const taskCount = document.getElementById("task-count");
    const searchInput = document.getElementById("search-input");

    const filterAll = document.getElementById("filter-all");
    const filterActive = document.getElementById("filter-active");
    const filterCompleted = document.getElementById("filter-completed");

    // Mengambil data dari Local Storage
    let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
    let currentFilter = "all";

    // Menyimpan data ke Local Storage
    function saveTasks() {
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    }

    // Menampilkan tugas
    function renderTasks() {
        taskList.innerHTML = "";

        let filteredTasks = tasks;

        // Filter berdasarkan status
        if (currentFilter === "active") {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        } else if (currentFilter === "completed") {
            filteredTasks = filteredTasks.filter(task => task.completed);
        }

        // Filter berdasarkan pencarian
        const keyword = searchInput.value.toLowerCase().trim();

        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(keyword)
        );

        taskCount.textContent = `${tasks.length} tugas`;

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <li class="empty-message">
                    Tugas tidak ditemukan.
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

            // Checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            // Nama tugas
            const taskText = document.createElement("span");
            taskText.className = "task-text";
            taskText.textContent = task.text;

            // Deadline
            const deadline = document.createElement("span");
            deadline.className = "deadline-text";
            deadline.textContent = task.deadline
                ? `Deadline: ${task.deadline}`
                : "Tanpa deadline";

            // Prioritas
            const priority = document.createElement("span");
            priority.className = "priority-text";
            priority.textContent = `Prioritas: ${task.priority}`;

            taskInfo.append(checkbox, taskText, deadline, priority);

            const buttonContainer = document.createElement("div");

            // Tombol Edit
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

            // Tombol Hapus
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

    // Menambahkan tugas
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

    // Pencarian tugas
    searchInput.addEventListener("input", () => {
        renderTasks();
    });

    // Menampilkan tugas saat halaman dibuka
    renderTasks();
});