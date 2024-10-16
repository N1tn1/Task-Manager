const mongoose = require('mongoose');
const connectDB = require('../db/connect');
const Priority = require('../models/Priority');
require('dotenv').config();


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

const start = async () => {
    await connectDB(process.env.MONGO_URI);
    await seedPriorities();
    mongoose.disconnect();
};

start().catch(err => {
    console.error(err);
    mongoose.disconnect();
});