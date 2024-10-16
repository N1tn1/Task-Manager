import React, { useState, useEffect } from 'react';
import InputWithLabel from './InputWithLabel';
import PropTypes from 'prop-types';
import style from './styles/AddTodoForm.module.css';
import axios from 'axios';

const AddTodoForm = ({ onAddTodo }) => {
    const [todoTitle, setTodoTitle] = useState('');
    const [priorityId, setPriorityId] = useState('');
    const [priorities, setPriorities] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/priorities');
                setPriorities(response.data);
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
    };

    const handleAddTodo = (event) => {
        event.preventDefault();
        if (todoTitle.trim() === '' || !priorityId) return;

        const selectedPriority = priorities.find(priority => priority._id === priorityId);
        if (selectedPriority) {
            onAddTodo({ title: todoTitle, isCompleted: false, priority: selectedPriority });
            setTodoTitle('');
            setPriorityId('');
        }
    };

    return (
        <form onSubmit={handleAddTodo}>
            <InputWithLabel 
                todoTitle={todoTitle} 
                handleTitleChange={handleTitleChange}
                id="todo-title"
                placeholder="Enter your tasks here">
                <span className={style.visuallyHidden}>Task</span>
            </InputWithLabel>
            <div className={style.input}>
            <select value={priorityId} onChange={handlePriorityChange} required>
                <option value="">Select Priority</option>
                {priorities.map(priority => (
                    <option key={priority._id} value={priority._id}>
                        {priority.name}
                    </option>
                ))}
            </select>
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