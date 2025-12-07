// frontend/script.js
const API_BASE_URL = '/api/tasks'; 

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

async function fetchTasks() {
    try {
        const response = await fetch(API_BASE_URL);
        const tasks = await response.json();
        todoList.innerHTML = ''; 
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.description}</span>
                <button class="delete-btn" data-task-id="${task.id}">Delete</button>
            `;
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function addTask(e) {
    e.preventDefault();
    const description = todoInput.value;

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        });

        if (response.ok) {
            todoInput.value = '';
            fetchTasks();
        } else {
            console.error('Failed to add task');
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchTasks();
        } else {
            console.error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

todoForm.addEventListener('submit', addTask);
document.addEventListener('DOMContentLoaded', fetchTasks);

todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const taskId = e.target.getAttribute('data-task-id');
        deleteTask(taskId);
    }
});