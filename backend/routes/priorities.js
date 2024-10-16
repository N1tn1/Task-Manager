const express = require('express');
const Priority = require('../models/Priority');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, level } = req.body;

  try {
    const priority = new Priority({ name, level });
    await priority.save();
    res.status(201).json(priority);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const priorities = await Priority.find();
    res.status(200).json(priorities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;