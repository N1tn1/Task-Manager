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

    const fetchTodos = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:3000/api/todos', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { search, sortBy, page, limit }
            });
    
            const todosWithPriority = response.data.todos.map(todo => {
                const priority = typeof todo.priority === 'object' ? todo.priority : 
                    priorities.find(p => p._id === todo.priorityId) || null; 
    
                return {
                    ...todo,
                    priority: priority ? {
                        _id: priority._id,
                        name: priority.name,
                       level: priority.level,
                    } : { _id: null, name: 'No Priority'}
                };
            });
    
            setTodos(todosWithPriority);
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

    const [isPrioritiesLoaded, setIsPrioritiesLoaded] = useState(false);

const fetchPriorities = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:3000/api/priorities', {
            headers: { Authorization: `Bearer ${token}` },
        });
        setPriorities(response.data.priorities);
        setIsPrioritiesLoaded(true); 
    } catch (error) {
        console.error('Error fetching priorities:', error);
    }
};

    

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };
    
    useEffect(() => {
        const fetchAllData = async () => {
            await fetchPriorities();
            await fetchTodos();
        };
        fetchAllData();
    }, [search, sortBy, page]);

    const handleSignIn = () => {
        navigate('/signin');
    };

    const addTodo = async (newTodo) => {
        if (!isPrioritiesLoaded) {
            return;
        }
    
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:3000/api/todos', newTodo, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            const addedTodo = { 
                ...response.data, 
                priority: priorities.find(p => p._id === response.data.priorityId) ,
        };
     setTodos(prevTodos => {
        
        if (!prevTodos.find(todo => todo._id === addedTodo._id)) {
            return [...prevTodos, addedTodo];
        }
        return prevTodos; 
    });
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
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(prevTodos => prevTodos.map(todo => (todo._id === id ? response.data : todo)));
        } catch (err) {
            handleApiError(err);
        }
    };

    const removeTodo = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedTodos = todos.filter(todo => todo._id !== id);
            setTodos(updatedTodos);
    
           
            if (updatedTodos.length === 0 && page > 1) {
                setPage(1); 
            }
        } catch (err) {
            handleApiError(err);
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
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(prevTodos => prevTodos.map(todo => (todo._id === id ? response.data : todo)));
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
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
            <h1 style={{ color: '#5f1308' }}>
                <FontAwesomeIcon icon={faClipboard} /> Tasks
            </h1>
            <AddTodoForm onAddTodo={addTodo} priorities={priorities} />
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