import React, { useState } from 'react';
import PropTypes from 'prop-types';
import style from './styles/TodoListItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

const TodoListItem = ({ todo, onRemoveTodo, onToggleTodo, onEditTodo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(todo.title);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        onEditTodo(todo._id, newTitle);
        setIsEditing(false);
    };

    return (
        <li className={style.ListItem}>
            <div className={style.todoContent}>
                <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => onToggleTodo(todo._id)}
                />
                {isEditing ? (
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className={style.editInput}
                    />
                ) : (
                    <span style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none', cursor: 'pointer' }}>
                        {todo.title} (Priority: {todo.priority?.name || 'None'} - Level: {todo.priority?.level || 'N/A'})
                    </span>
                )}
            </div>
            <div className={style.buttonColumn}>
            {isEditing ? (
                <button className={style.editbtn} onClick={handleSaveClick}>
                    <FontAwesomeIcon icon={faSave} />
                </button>
            ) : (
                <>
                    <button className={style.editbtn} onClick={handleEditClick}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className={style.rmvbtn} onClick={() => onRemoveTodo(todo._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </>
            )}
            </div>
        </li>
    );
};

TodoListItem.propTypes = {
    todo: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        priority: PropTypes.shape({
            name: PropTypes.string,
            level: PropTypes.number,
        }),
    }).isRequired,
    onRemoveTodo: PropTypes.func.isRequired,
    onToggleTodo: PropTypes.func.isRequired,
    onEditTodo: PropTypes.func.isRequired,
};

export default TodoListItem;