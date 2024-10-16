const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Task title is required'], 
        trim: true, 
    },
    description: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                return value.length >= 10; 
            },
            message: 'Description must be at least 10 characters long'
        }
    },
    dueDate: { 
        type: Date,
        validate: {
            validator: function(value) {
                return value > Date.now()
            },
            message: props => `Due date (${props.value}) must be in the future`
        },
    },
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
    priority: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Priority', 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
    }
    }, { timestamps: true})
    
    TodoSchema.index({ user: 1 });

module.exports = mongoose.model('Todo', TodoSchema);