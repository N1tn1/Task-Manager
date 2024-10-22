import React, { useEffect, useState } from 'react';
import InputWithLabel from './InputWithLabel';
import PropTypes from 'prop-types';
import style from './styles/AddTodoForm.module.css';
import axios from 'axios';

const AddTodoForm = ({ onAddTodo }) => {
    const [todoTitle, setTodoTitle] = useState('');
    const [priorityId, setPriorityId] = useState('');
    const [newPriorityName, setNewPriorityName] = useState('');
    const [newPriorityLevel, setNewPriorityLevel] = useState(1);
    const [priorities, setPriorities] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/priorities', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setPriorities(response.data.priorities);
            } catch (error) {
                console.error('Error fetching priorities:', error);
                setError('Failed to load priorities');
            }
        };
        fetchPriorities();
    }, []);

    const handleTitleChange = (event) => {
        setTodoTitle(event.target.value);
    };

    const handlePriorityChange = (event) => {
        setPriorityId(event.target.value);
        if (event.target.value === 'new') {
            setNewPriorityName('');
            setNewPriorityLevel(1); 
        }
    };

    const handleNewPriorityNameChange = (event) => {
        setNewPriorityName(event.target.value);
    };

    const handleNewPriorityLevelChange = (event) => {
        setNewPriorityLevel(Number(event.target.value));
    };

    const handleAddTodo = async (event) => {
        event.preventDefault();
        if (todoTitle.trim() === '' || (!priorityId && priorityId !== 'new')) return;
    
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found');
            return;
        }
        
        try {
            let priorityToSend = null;
            
            if (priorityId === 'new' && newPriorityName.trim()) {
                const newPriorityResponse = await axios.post('http://localhost:3000/api/priorities', {
                    name: newPriorityName,
                    level: 1 
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                priorityToSend = newPriorityResponse.data.priority; 
            } else {
                priorityToSend = priorities.find(p => p._id === priorityId);
            }
    
            const newTodo = {
                title: todoTitle,
                isCompleted: false,
                priority: priorityToSend, 
            };
    
            await axios.post('http://localhost:3000/api/todos', newTodo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            onAddTodo(newTodo); 
            setTodoTitle('');
            setPriorityId('');
            setNewPriorityName('');
        } catch (error) {
            console.error('Error adding todo:', error.response ? error.response.data : error);
            setError('Failed to add task');
        }
    };

    return (
        <form onSubmit={handleAddTodo}>
            <InputWithLabel
                className={style.inputField}
                todoTitle={todoTitle}
                handleTitleChange={handleTitleChange}
                id="todo-title"
                placeholder="Enter your tasks here">
                <span className={style.visuallyHidden}>Task</span>
            </InputWithLabel>
            <div className={style.input}>
                <select className={style.select} value={priorityId} onChange={handlePriorityChange} required>
                    <option value="">Select Priority</option>
                    {priorities.map(priority => (
                        <option key={priority._id} value={priority._id}>
                            {priority.name} (Level: {priority.level})
                        </option>
                    ))}
                    <option value="new">Add New Priority</option>
                </select>
                {priorityId === 'new' && (
                    <>
                        <input
                            className={style.inputField}
                            type="text"
                            value={newPriorityName}
                            onChange={handleNewPriorityNameChange}
                            placeholder="Enter new priority"
                            required
                        />
                        <input
                            className={style.inputField}
                            type="number"
                            value={newPriorityLevel}
                            onChange={handleNewPriorityLevelChange}
                            placeholder="Enter priority level"
                            required
                            min="1" 
                        />
                    </>
                )}
            </div>
            {error && <p className={style.error}>{error}</p>}
            <button className={style.addbtn} type="submit"> Add Task </button>
        </form>
    );
};

AddTodoForm.propTypes = {
    onAddTodo: PropTypes.func.isRequired,
};

export default AddTodoForm;

