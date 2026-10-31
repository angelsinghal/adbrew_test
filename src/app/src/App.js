import './App.css';
import logo from './logo.svg';
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchTodos, createTodo } from './services/todoApi';

export function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [submitting, setSubmitting] = useState(false);
useEffect(() => {
  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadTodos();
}, []);
  const handleSubmit = async (event)=>{

    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('TODO title cannot be empty.');
    return;
  }
    try {
    setError('');
    setSubmitting(true);

    await createTodo({ title: trimmedTitle });

    // Fetch the latest list from the backend.
    const updatedTodos = await fetchTodos();
    setTodos(updatedTodos);

    setTitle('');
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};
  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>
        {loading && <p>Loading TODOs...</p>}

  {error && <p>{error}</p>}

  {!loading && !error && todos.length === 0 && (
    <p>No TODOs found.</p>
  )}

  {!loading && !error && (
    <ol className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ol>
  )}
      </div>
      <div>
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input id="todo"type="text" value={title} onChange={(event)=>setTitle(event.target.value)} />
          </div>
          <div style={{"marginTop": "5px"}}>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Adding ToDo...' : 'Add ToDo!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
