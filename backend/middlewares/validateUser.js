const Todo = require('../models/Todo');

const validateUser = async (req, res, next) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        if (todo.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        req.todo = todo; 
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { validateUser };