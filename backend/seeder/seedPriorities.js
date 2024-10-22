const mongoose = require('mongoose');
const Priority = require('../models/Priority');

const seedPriorities = async () => {
    const priorities = ['low', 'medium', 'high'];

    for (const priority of priorities) {
        await Priority.findOneAndUpdate(
            { name: priority },
            { level: priorities.indexOf(priority) + 1 },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }

    console.log('Priorities seeded!');
};

module.exports = seedPriorities;