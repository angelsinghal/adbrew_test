const API_URL = 'http://localhost:8000/todos/';

export async function fetchTodos() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch TODOs');
  }

  const data = await response.json();
  return [...data.todos].reverse();
}

export async function createTodo(todoData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  });

  if (!response.ok) {
    throw new Error('Failed to create TODO');
  }

  return response.json();
}