const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    maxlength: 100 
  },
  description: { 
    type: String, 
    default: '', 
    maxlength: 500 
  },
  status: { 
    type: String, 
    enum: ['not-started', 'in-progress', 'completed'], 
    default: 'not-started' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  dueDate: { 
    type: Date, 
    default: null 
  },
  userId: {
    type: String,
    required: [true, 'User ID is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
