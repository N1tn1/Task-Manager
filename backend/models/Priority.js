const mongoose = require('mongoose');

const prioritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: Number,
    required: true,
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
}
}, { timestamps: true });

const Priority = mongoose.model('Priority', prioritySchema);

module.exports = Priority;