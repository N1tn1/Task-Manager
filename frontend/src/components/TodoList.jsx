import React from 'react';
import PropTypes from 'prop-types';
import TodoListItem from './TodoListItem';
import style from './styles/TodoList.module.css';

const TodoList = ({ todoList, onRemoveTodo, onToggleTodo, onEditTodo, priorities }) => {
    const completedTodos = todoList.filter(todo => todo.isCompleted);
    const activeTodos = todoList.filter(todo => !todo.isCompleted);
    
    return (
        <div className={style.todoContainer}>
            {activeTodos.length === 0 ? (
                <div className={style.notCompleted}>
                    <p style={{ fontStyle: 'italic' }}>No Active Tasks.</p>
                </div>
            ) : (
                <div className={style.activeTasks}>
                    <h2>Active Tasks</h2>
                    <ul className={style.todoList}>
                        {activeTodos.map(todo => (
                            <TodoListItem
                                key={todo._id}
                                todo={todo}
                                onRemoveTodo={onRemoveTodo}
                                onToggleTodo={onToggleTodo}
                                onEditTodo={onEditTodo}
                                priorities={priorities}
                            />
                        ))}
                    </ul>
                </div>
            )}
            {completedTodos.length > 0 && (
                <div className={style.completedTasks}>
                    <h2>Completed Tasks</h2>
                    <ul className={style.todoList}>
                        {completedTodos.map(todo => (
                            <TodoListItem
                                key={todo._id}
                                todo={todo}
                                onRemoveTodo={onRemoveTodo}
                                onToggleTodo={onToggleTodo}
                                onEditTodo={onEditTodo}
                                priorities={priorities}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

TodoList.propTypes = {
    todoList: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            isCompleted: PropTypes.bool.isRequired,
            priority: PropTypes.shape({
                _id: PropTypes.string,
                name: PropTypes.string.isRequired,
                level: PropTypes.number.isRequired, 
            }),
        })
    ).isRequired,
    onRemoveTodo: PropTypes.func.isRequired,
    onToggleTodo: PropTypes.func.isRequired,
    onEditTodo: PropTypes.func.isRequired,
    priorities: PropTypes.array.isRequired,
};

export default TodoList;
