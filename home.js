document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username") || "User";
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
    }

    document.getElementById("username").textContent = username;

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "index.html";
    });

    const todoForm = document.getElementById("todo-form");
    const todoList = document.getElementById("todo-list");

    // Fetch and display tasks
    async function fetchTodos() {
        const response = await fetch("http://127.0.0.1:5000/todos", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const todos = await response.json();
        todoList.innerHTML = "";
        todos.forEach((todo) => {
            const li = document.createElement("li");
            li.textContent = todo.task;
            const completeButton = document.createElement("button");
            completeButton.textContent = "Complete";
            completeButton.addEventListener("click", () => deleteTask(todo.id));
            li.appendChild(completeButton);
            todoList.appendChild(li);
        });
    }

    // Add new task
    todoForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const task = document.getElementById("task").value;
        await fetch("http://127.0.0.1:5000/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ task }),
        });
        fetchTodos();
        document.getElementById("task").value = "";
    });

    // Delete task
    async function deleteTask(id) {
        await fetch(`http://127.0.0.1:5000/todos/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchTodos();
    }

    fetchTodos();
});
