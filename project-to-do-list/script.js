document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskDeadline = document.getElementById("task-deadline");
    const taskPriority = document.getElementById("task-priority");
    const taskCategory = document.getElementById("task-category");
    const taskRepeat = document.getElementById("task-repeat");
    const taskList = document.getElementById("task-list");
    const taskCount = document.getElementById("task-count");
    const searchInput = document.getElementById("search-input");

    const filterAll = document.getElementById("filter-all");
    const filterActive = document.getElementById("filter-active");
    const filterCompleted = document.getElementById("filter-completed");

    let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
    let currentFilter = "all";

    // Mengambil tanggal hari ini
    function getToday() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // Mengatur tanggal hari ini secara otomatis
    function setTodayDeadline() {
        taskDeadline.value = getToday();
    }

    // Mengubah format tanggal menjadi DD/MM/YYYY
    function formatDate(dateString) {
        if (!dateString) return "";

        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    }

    // Memeriksa dan mereset tugas harian
    function updateDailyTasks() {
        const today = getToday();
        let updated = false;

        tasks.forEach(task => {
            if (task.repeatDaily) {
                if (task.lastResetDate !== today) {
                    task.completed = false;
                    task.lastResetDate = today;
                    updated = true;
                }
            }
        });

        if (updated) {
            saveTasks();
        }
    }

    // Menyimpan tugas
    function saveTasks() {
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    }

    // Menampilkan tugas
    function renderTasks() {
        updateDailyTasks();
        taskList.innerHTML = "";

        let filteredTasks = tasks;

        // Filter berdasarkan status
        if (currentFilter === "active") {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        } else if (currentFilter === "completed") {
            filteredTasks = filteredTasks.filter(task => task.completed);
        }

        // Pencarian berdasarkan nama, kategori, prioritas, dan deadline
        const keyword = searchInput.value.toLowerCase().trim();

        filteredTasks = filteredTasks.filter(task =>
            (task.text || "").toLowerCase().includes(keyword) ||
            (task.category || "Lainnya").toLowerCase().includes(keyword) ||
            (task.priority || "").toLowerCase().includes(keyword) ||
            (task.deadline || "").toLowerCase().includes(keyword) ||
            formatDate(task.deadline).toLowerCase().includes(keyword)
        );

        // Menghitung jumlah seluruh tugas
        taskCount.textContent = `${tasks.length} tugas`;

        // Pesan jika tugas tidak ditemukan
        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <li class="empty-message">
                    Tugas tidak ditemukan.
                </li>
            `;
            return;
        }

        // Menampilkan setiap tugas
        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = "task-item";

            if (task.completed) {
                li.classList.add("completed");
            }

            const taskInfo = document.createElement("div");
            taskInfo.className = "task-info";

            // Checkbox status tugas
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
                ? `Deadline: ${formatDate(task.deadline)}`
                : "Tanpa deadline";

            // Prioritas
            const priority = document.createElement("span");
            priority.className = "priority-text";
            priority.textContent = `Prioritas: ${task.priority || "-"}`;

            // Kategori
            const category = document.createElement("span");
            category.className = "category-text";
            category.textContent = `Kategori: ${task.category || "Lainnya"}`;

            // Informasi pengulangan
            if (task.repeatDaily) {
                const repeatLabel = document.createElement("span");
                repeatLabel.className = "repeat-text";
                repeatLabel.textContent = "Ulangi setiap hari";
                taskInfo.append(repeatLabel);
            }

            taskInfo.append(
                checkbox,
                taskText,
                deadline,
                priority,
                category
            );

            const buttonContainer = document.createElement("div");

            // Edit
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

            // Hapus
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

    // Tambah tugas
    taskForm.addEventListener("submit", event => {
        event.preventDefault();

        const text = taskInput.value.trim();

        if (text === "") {
            alert("Nama tugas tidak boleh kosong!");
            return;
        }

        const today = getToday();

        const newTask = {
            id: Date.now(),
            text: text,
            deadline: taskDeadline.value,
            priority: taskPriority.value,
            category: taskCategory ? taskCategory.value : "Lainnya",
            completed: false,
            repeatDaily: taskRepeat.checked,
            lastResetDate: today
        };

        tasks.push(newTask);

        saveTasks();
        renderTasks();
        taskForm.reset();

        // Mengisi kembali tanggal hari ini
        setTodayDeadline();
    });

    // Filter semua
    filterAll.addEventListener("click", () => {
        currentFilter = "all";
        setActiveFilter(filterAll);
        renderTasks();
    });

    // Filter belum selesai
    filterActive.addEventListener("click", () => {
        currentFilter = "active";
        setActiveFilter(filterActive);
        renderTasks();
    });

    // Filter selesai
    filterCompleted.addEventListener("click", () => {
        currentFilter = "completed";
        setActiveFilter(filterCompleted);
        renderTasks();
    });

    // Tombol filter aktif
    function setActiveFilter(activeButton) {
        [filterAll, filterActive, filterCompleted].forEach(button => {
            button.classList.remove("active");
        });

        activeButton.classList.add("active");
    }

    // Pencarian tugas
    searchInput.addEventListener("input", renderTasks);

    // Tanggal hari ini muncul saat aplikasi dibuka
    setTodayDeadline();

    // Periksa tugas harian saat aplikasi dibuka
    updateDailyTasks();

    // Tampilkan tugas
    renderTasks();

    // Periksa pergantian hari selama aplikasi terbuka
    setInterval(() => {
        updateDailyTasks();
        renderTasks();
    }, 60000);
});