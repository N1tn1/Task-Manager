const express = require('express');
const { getPriorityById, getPriorities, createPriority, updatePriority, deletePriority } = require('../controllers/priorities.js');
const auth = require('../middlewares/auth');
const router = express.Router();

router.route('/').post(auth, createPriority).get(auth, getPriorities);
router.route('/:id').get(auth, getPriorityById).put(auth, updatePriority).delete(auth, deletePriority);

module.exports = router;