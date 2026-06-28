const Task = require('../models/Task');

// @desc    Get all tasks for current user
// @route   GET /api/tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID header is missing'
      });
    }

    const query = { userId };
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const task = await Task.findOne({ _id: req.params.id, userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID header is missing'
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description || '',
      status: status || 'not-started',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      userId
    });

    res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    let task = await Task.findOne({ _id: req.params.id, userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied'
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;
    if (priority !== undefined) updateFields.priority = priority;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;

    task = await Task.findOneAndUpdate({ _id: req.params.id, userId }, updateFields, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const task = await Task.findOne({ _id: req.params.id, userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied'
      });
    }

    await Task.findOneAndDelete({ _id: req.params.id, userId });

    res.status(200).json({
      success: true,
      message: 'Task deleted'
    });
  } catch (err) {
    next(err);
  }
};
