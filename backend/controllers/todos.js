const Todo = require('../models/Todo');
const Priority = require('../models/Priority');

const validatePriorityId = async (req, res, next) => {
  const { priority } = req.body;
  if (priority) {
      const foundPriority = await Priority.findById(priority);
      if (!foundPriority) {
          return res.status(400).json({ message: 'Invalid priority ID' });
      }
  }
  next();
};

exports.createTodo = [
  validatePriorityId,
  async (req, res, next) => {
    try {
      const todo = new Todo({
        ...req.body,
        user: req.user._id,
      });
      await todo.save();
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  }
]

exports.getTodos = async (req, res, next) => {
    const { search, sortBy, page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
        return res.status(400).json({ msg: 'Page and limit must be positive integers.' });
    }
    try {
      const query = { user: req.user._id };
  
      // Search functionality
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
  
      // Sorting functionality
      const sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = 1;
      }
  
      // Pagination
      const todos = await Todo.find(query)
        .populate('priority')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));
  
      const totalTodos = await Todo.countDocuments(query);
  
      res.status(200).json({
        todos,
        total: totalTodos,
        totalPages: Math.ceil(totalTodos / limit),
        currentPage: Number(page),
      });
    } catch (error) {
      next(error);
    }
  };

exports.updateTodo = [
  validatePriorityId,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const todo = await Todo.findOneAndUpdate(
        { _id: id, user: req.user._id },
        req.body,
        { new: true, runValidators: true }
      ).populate('priority');

      if (!todo) {
        return res.status(404).json({ msg: 'Task not found' });
      }
      res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  }
]; 

exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(200).json({ msg: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};