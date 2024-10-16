import React, { useEffect, useState } from 'react';
import AddTodoForm from './AddTodoForm'; 
import TodoList from './TodoList'; 
import style from './styles/TodoContainer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faSearch, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TodoContainer = () => {
    const [todos, setTodos] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('createdAt'); 
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTodos = async () => {
            const token = localStorage.getItem('token');
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:3000/api/todos', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: { search, sortBy, page, limit }
                });
                console.log(response.data.todos);
                setTodos(response.data.todos);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Session expired. Please sign in again.');
                } else {
                    setError('Failed to fetch tasks');
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchTodos();
    }, [search, sortBy, page, limit]);

    // Fetch priorities
    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/priorities');
                setPriorities(response.data); 
            } catch (error) {
                console.error('Error fetching priorities:', error);
            }
        };

        fetchPriorities();
    }, []); 

    const handleSignIn = () => {
        navigate('/signin');
    };

    const addTodo = async (newTodo) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:3000/api/todos', newTodo, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTodos(prevTodos => [...prevTodos, response.data]);
        } catch (err) {
            setError('Failed to add task');
            console.error('Failed to add task:', err);
        }
    };

    const toggleTodo = async (id) => {
        const token = localStorage.getItem('token');
        const todo = todos.find(todo => todo._id === id);
        try {
            const response = await axios.put(`http://localhost:3000/api/todos/${id}`, {
                ...todo,
                isCompleted: !todo.isCompleted
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTodos(prevTodos => prevTodos.map(todo => (todo._id === id ? response.data : todo)));
        } catch (err) {
            setError('Failed to toggle todo');
            console.error('Failed to toggle todo:', err);
        }
    };

    const removeTodo = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/api/todos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
        } catch (err) {
            setError('Failed to delete task');
            console.error('Failed to delete task:', err);
        }
    };

    const editTodo = async (id, newTitle) => {
        const token = localStorage.getItem('token');
        const todo = todos.find(todo => todo._id === id);
        try {
            const response = await axios.put(`http://localhost:3000/api/todos/${id}`, {
                ...todo,
                title: newTitle
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTodos(prevTodos => prevTodos.map(todo => (todo._id === id ? response.data : todo)));
        } catch (err) {
            setError('Failed to edit task');
            console.error('Failed to edit task:', err);
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const renderError = () => (
        <div>
            <p>{error}</p>
            {error === 'Session expired. Please sign in again.' && (
                <button onClick={handleSignIn}>Sign In</button>
            )}
        </div>
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div className={style.todoContainer}>
            <div className={style.searchContainer}>
                <input 
                    className={style.input}
                    type="text" 
                    placeholder="Search..." 
                    value={search}
                    onChange={handleSearchChange} 
                />
                <FontAwesomeIcon icon={faSearch} className={style.icon} />
            </div>
            <h1 style={{color: '#5f1308'}}> <FontAwesomeIcon icon={faClipboard} /> Tasks </h1>
            <AddTodoForm onAddTodo={addTodo} />
            
            {error && renderError()}
    
            {todos.length > 0 ? (
                <>
                    <select className={style.sortinput} onChange={handleSortChange} value={sortBy}>
                        <option value="createdAt">Created At</option>
                        <option value="title">Title</option>
                    </select>
                    <TodoList
                        todoList={todos}
                        onRemoveTodo={removeTodo}
                        onToggleTodo={toggleTodo}
                        onEditTodo={editTodo}
                        priorities={priorities}
                    />
                    <div className={style.pagination}>
                        <button 
                            className={style.pagebtn}
                            onClick={() => handlePageChange(page - 1)} 
                            disabled={page === 1}
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </button>
                        <span>Page {page}</span>
                        <button 
                            className={style.pagebtn}
                            onClick={() => handlePageChange(page + 1)} 
                            disabled={todos.length < limit}
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </button>
                    </div>
                </>
            ) : (
                !loading && <p style={{ fontStyle: 'italic' }}>No tasks available.</p>
            )}
        </div>
    );
};

export default TodoContainer;