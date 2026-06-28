import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createTask, updateTask } from '../api/taskApi';
import { FiX } from 'react-icons/fi';

const TaskFormModal = ({ taskToEdit, onClose, onSuccess, fetchTasks, recordNotification }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('not-started');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const formatInputDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'not-started');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(formatInputDate(taskToEdit.dueDate));
    } else {
      setTitle('');
      setDescription('');
      setStatus('not-started');
      setPriority('medium');
      setDueDate('');
    }
    setErrors({});
  }, [taskToEdit]);

  const validate = () => {
    const tempErrors = {};
    if (!title.trim()) {
      tempErrors.title = 'Title is required';
    } else if (title.length > 100) {
      tempErrors.title = 'Title cannot exceed 100 characters';
    }

    if (description.length > 500) {
      tempErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null
    };

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, taskData);
        if (recordNotification) {
          recordNotification(title.trim(), 'updated');
        }
        toast.success('Task updated');
      } else {
        await createTask(taskData);
        if (recordNotification) {
          recordNotification(title.trim(), 'created');
        }
        toast.success('Task created');
      }
      onSuccess(); // Close modal and refresh App tasks list
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'An error occurred';
      toast.error(taskToEdit ? 'Failed to update task' : 'Failed to create task');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="organizo-modal-overlay" onClick={onClose}>
      <div className="organizo-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <FiX />
        </button>
        <h2 className="modal-title">
          {taskToEdit ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Title field (Required) */}
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Finish monthly reporting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <div className="error-feedback" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {errors.title}
              </div>
            )}
          </div>

          {/* Description field */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Provide a brief task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
            {errors.description && (
              <div className="error-feedback">{errors.description}</div>
            )}
          </div>

          {/* Status & Priority fields */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stage (Status)</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="not-started">Not started</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date field */}
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose} 
              style={{ padding: '8px 24px', borderRadius: '999px', border: '1px solid var(--border)' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={submitting} 
              style={{ background: '#F5C518', color: '#1A1A1A', padding: '8px 24px', borderRadius: '999px', fontWeight: 600 }}
            >
              {submitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
