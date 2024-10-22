import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import style from './styles/AddTodoForm.module.css';

const InputWithLabel = ({ todoTitle, handleTitleChange, children, id, placeholder }) => {
       

    return (
        <div>
            <label htmlFor={id}>
                {children}
                    <input
                        className={style.inputField}
                        type="text"
                        value={todoTitle}
                        onChange={handleTitleChange}
                        id={id}
                        placeholder={placeholder}
                    />
            </label>
        </div>
    );
};

InputWithLabel.propTypes = {
  todoTitle: PropTypes.string.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

export default InputWithLabel;