```javascript
document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskDeadline = document.getElementById("task-deadline");
    const taskPriority = document.getElementById("task-priority");
    const taskCategory = document.getElementById("task-category");
    const taskRepeat = document.getElementById("task-repeat");

    const searchInput = document.getElementById("search-input");
    const taskList = document.getElementById("task-list");
    const taskCount = document.getElementById("task-count");

    const filterAll = document.getElementById("filter-all");
    const filterActive = document.getElementById("filter-active");
    const filterCompleted = document.getElementById("filter-completed");

    const filterPriorityAll = document.getElementById("filter-priority-all");
    const filterLow = document.getElementById("filter-low");
    const filterMedium = document.getElementById("filter-medium");
    const filterHigh = document.getElementById("filter-high");

    if (!taskForm || !taskInput || !taskList || !taskCount) {
        console.error("Elemen HTML tidak ditemukan.");
        return;
    }

    let tasks = [];

    try {
        const savedTasks = JSON.parse(localStorage.getItem("todoTasks"));
        tasks = Array.isArray(savedTasks) ? savedTasks : [];
    } catch (error) {
        console.error("Gagal membaca Local Storage:", error);
        tasks = [];
    }

    let statusFilter = "all";
    let priorityFilter = "all";

    function getToday() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return year + "-" + month + "-" + day;
    }

    function saveTasks() {
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    }

    function resetDailyTasks() {
        const today = getToday();

        tasks.forEach(function (task) {
            if (
                task.repeatDaily &&
                task.completed &&
                task.lastCompletedDate !== today
            ) {
                task.completed = false;
            }
        });

        saveTasks();
    }

    function formatDate(date) {
        if (!date) return "-";

        const parts = date.split("-");

        if (parts.length !== 3) return date;

        return parts[2] + "/" + parts[1] + "/" + parts[0];
    }

    function getPriorityClass(priority) {
        if (priority === "Rendah") return "priority-low";
        if (priority === "Sedang") return "priority-medium";
        if (priority === "Tinggi") return "priority-high";

        return "";
    }

    function createTaskElement(task) {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const information = document.createElement("div");
        information.className = "task-information";

        const title = document.createElement("h3");
        title.textContent = task.name;

        if (task.completed) {
            title.classList.add("completed-text");
        }

        const details = document.createElement("p");
        details.textContent =
            "Kategori: " + task.category +
            " | Prioritas: " + task.priority +
            " | Deadline: " + formatDate(task.deadline);

        const priority = document.createElement("span");
        priority.className =
            "priority-badge " + getPriorityClass(task.priority);
        priority.textContent = task.priority;

        information.appendChild(title);
        information.appendChild(details);
        information.appendChild(priority);

        if (task.repeatDaily) {
            const repeatInfo = document.createElement("small");
            repeatInfo.textContent = "Diulang setiap hari";
            information.appendChild(repeatInfo);
        }

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = Boolean(task.completed);

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;

            if (task.completed) {
                task.lastCompletedDate = getToday();
            }

            saveTasks();
            renderTasks();
        });

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.className = "edit-button";

        editButton.addEventListener("click", function () {
            editTask(task.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Hapus";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        actions.appendChild(checkbox);
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(information);
        li.appendChild(actions);

        return li;
    }

    function renderTasks() {
        taskList.innerHTML = "";

        const keyword = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const filteredTasks = tasks.filter(function (task) {
            const name = String(task.name || "").toLowerCase();
            const category = String(task.category || "").toLowerCase();
            const priority = String(task.priority || "").toLowerCase();
            const deadline = String(task.deadline || "").toLowerCase();

            const matchesSearch =
                name.includes(keyword) ||
                category.includes(keyword) ||
                priority.includes(keyword) ||
                deadline.includes(keyword);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && !task.completed) ||
                (statusFilter === "completed" && task.completed);

            const matchesPriority =
                priorityFilter === "all" ||
                task.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });

        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.className = "empty-state";
            emptyMessage.textContent = "Belum ada tugas ditemukan.";

            taskList.appendChild(emptyMessage);
        } else {
            filteredTasks.forEach(function (task) {
                taskList.appendChild(createTaskElement(task));
            });
        }

        const completedCount = tasks.filter(function (task) {
            return task.completed;
        }).length;

        taskCount.textContent =
            tasks.length + " tugas | " +
            completedCount + " selesai";
    }

    function addTask(event) {
        event.preventDefault();

        const name = taskInput.value.trim();

        if (!name) {
            alert("Nama tugas harus diisi.");
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            name: name,
            deadline: taskDeadline ? taskDeadline.value : "",
            priority: taskPriority ? taskPriority.value : "Sedang",
            category: taskCategory ? taskCategory.value : "Lainnya",
            repeatDaily: taskRepeat ? taskRepeat.checked : false,
            completed: false,
            lastCompletedDate: null
        };

        tasks.push(newTask);

        saveTasks();
        taskForm.reset();

        if (taskPriority) taskPriority.value = "Sedang";
        if (taskCategory) taskCategory.value = "Lainnya";

        renderTasks();
    }

    function editTask(id) {
        const task = tasks.find(function (item) {
            return item.id === id;
        });

        if (!task) return;

        const newName = prompt("Nama tugas:", task.name);

        if (newName === null) return;

        if (!newName.trim()) {
            alert("Nama tugas tidak boleh kosong.");
            return;
        }

        task.name = newName.trim();

        const newDeadline = prompt(
            "Deadline (YYYY-MM-DD):",
            task.deadline || ""
        );

        if (newDeadline !== null) {
            task.deadline = newDeadline.trim();
        }

        const newPriority = prompt(
            "Prioritas (Rendah, Sedang, Tinggi):",
            task.priority
        );

        if (newPriority !== null) {
            const value = newPriority.trim();

            if (["Rendah", "Sedang", "Tinggi"].includes(value)) {
                task.priority = value;
            } else {
                alert("Prioritas tidak valid.");
            }
        }

        const newCategory = prompt(
            "Kategori (Kuliah, Kerja, Pribadi, Lainnya):",
            task.category
        );

        if (newCategory !== null) {
            const value = newCategory.trim();

            if (["Kuliah", "Kerja", "Pribadi", "Lainnya"].includes(value)) {
                task.category = value;
            } else {
                alert("Kategori tidak valid.");
            }
        }

        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        const confirmation = confirm("Yakin ingin menghapus tugas ini?");

        if (!confirmation) return;

        tasks = tasks.filter(function (task) {
            return task.id !== id;
        });

        saveTasks();
        renderTasks();
    }

    function setStatusFilter(filter, activeButton) {
        statusFilter = filter;

        [filterAll, filterActive, filterCompleted].forEach(function (button) {
            if (button) button.classList.remove("active");
        });

        if (activeButton) activeButton.classList.add("active");

        renderTasks();
    }

    if (filterAll) {
        filterAll.addEventListener("click", function () {
            setStatusFilter("all", filterAll);
        });
    }

    if (filterActive) {
        filterActive.addEventListener("click", function () {
            setStatusFilter("active", filterActive);
        });
    }

    if (filterCompleted) {
        filterCompleted.addEventListener("click", function () {
            setStatusFilter("completed", filterCompleted);
        });
    }

    function setPriorityFilter(priority, activeButton) {
        priorityFilter = priority;

        [
            filterPriorityAll,
            filterLow,
            filterMedium,
            filterHigh
        ].forEach(function (button) {
            if (button) button.classList.remove("active");
        });

        if (activeButton) activeButton.classList.add("active");

        renderTasks();
    }

    if (filterPriorityAll) {
        filterPriorityAll.addEventListener("click", function () {
            setPriorityFilter("all", filterPriorityAll);
        });
    }

    if (filterLow) {
        filterLow.addEventListener("click", function () {
            setPriorityFilter("Rendah", filterLow);
        });
    }

    if (filterMedium) {
        filterMedium.addEventListener("click", function () {
            setPriorityFilter("Sedang", filterMedium);
        });
    }

    if (filterHigh) {
        filterHigh.addEventListener("click", function () {
            setPriorityFilter("Tinggi", filterHigh);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", renderTasks);
    }

    taskForm.addEventListener("submit", addTask);

    resetDailyTasks();
    renderTasks();
});
```