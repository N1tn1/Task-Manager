const express = require('express');
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todos');
const auth = require('../middlewares/auth');
const router = express.Router();

router.route('/').post(auth, createTodo).get(auth, getTodos);
router.route('/:id').put(auth, updateTodo).delete(auth, deleteTodo);

module.exports = router;
