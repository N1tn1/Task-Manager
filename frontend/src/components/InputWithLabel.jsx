import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const InputWithLabel = ({ todoTitle, handleTitleChange, children, id, placeholder }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);      

    return (
        <div>
            <label htmlFor={id}>
                {children}
                    <input
                        type="text"
                        value={todoTitle}
                        onChange={handleTitleChange}
                        ref={inputRef}
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