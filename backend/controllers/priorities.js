const Priority = require('../models/Priority');

exports.getPriorities = async (req, res) => {
    try {
        const basePriorities = await Priority.find({ user: { $exists: false } });
        const userPriorities = await Priority.find({ user: req.user._id });

        const combinedPriorities = basePriorities.map(base => {
            const userPriority = userPriorities.find(user => user.name === base.name);
            return userPriority || base;
        });

        userPriorities.forEach(userPriority => {
            const existsInBase = combinedPriorities.some(base => base.name === userPriority.name);
            if (!existsInBase) {
                combinedPriorities.push(userPriority);
            }
        });

        res.status(200).json({ priorities: combinedPriorities });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to fetch priorities', error: error.message });
    }

}

exports.getPriorityById = async (req, res) => {
    try {
        const { id } = req.params;
        let priority = await Priority.findOne({ _id: id, user: req.user._id });

        if (!priority) {
            priority = await Priority.findById(id);
        }

        if (!priority) {
            return res.status(404).json({ msg: 'Priority not found' });
        }

        res.status(200).json({ priority });
    } catch (error) {
        res.status(400).json({ msg: 'Failed to fetch priority', error: error.message });
    }

}

exports.createPriority = async (req, res) => {
    const { name, level } = req.body;

    try {
        const priority = new Priority({
            name,
            level,
            user: req.user._id 
        });

        await priority.save();
        res.status(201).json({ priority });
    } catch (error) {
        res.status(400).json({ msg: 'Failed to create priority', error: error.message });
    }

}

exports.updatePriority = async (req, res) => {
    const { id } = req.params;
    const { name, level } = req.body;

    try {
        let priority = await Priority.findOne({ _id: id, user: req.user._id });

        if (!priority) {
            const basePriority = await Priority.findOne({ _id: id, user: { $exists: false } });

            if (basePriority) {
                return res.status(403).json({ msg: 'You are not authorized to edit this priority' });
            } else {
                return res.status(404).json({ msg: 'Priority not found' });
            }
        } else {
            priority.name = name;
            priority.level = level;
        }

        await priority.save();
        res.status(200).json({ priority });
    } catch (error) {
        res.status(400).json({ msg: 'Failed to update priority', error: error.message });
    }

}

exports.deletePriority = async (req, res) => {
    const { id } = req.params;

    try {
        const priority = await Priority.findById(id);

        if (!priority) {
            return res.status(404).json({ msg: 'Priority not found' });
        }
        if (!priority.user) {
            return res.status(403).json({ msg: 'You are not authorized to delete this priority' });
        }
        await Priority.findOneAndDelete({ _id: id, user: req.user._id });

        res.status(200).json({ msg: 'Priority deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to delete priority', error: error.message });
    }

}