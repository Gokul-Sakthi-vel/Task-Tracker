import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createTask, updateTask } from '../api/taskApi';
import { FiX } from 'react-icons/fi';

const TaskForm = ({ taskToEdit, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [team, setTeam] = useState('Operations');
  const [project, setProject] = useState('Secret project');
  const [assigneeId, setAssigneeId] = useState('me');
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Assignee preset profiles
  const assigneeProfiles = {
    me: { name: 'Me', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    john: { name: 'John Deere', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    sarah: { name: 'Sarah Connor', avatar: 'https://randomuser.me/api/portraits/men/85.jpg' },
    david: { name: 'David Smith', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
    robert: { name: 'Robert Garcia', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' }
  };

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
      setStatus(taskToEdit.status || 'pending');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(formatInputDate(taskToEdit.dueDate));
      setTeam(taskToEdit.team || 'Operations');
      setProject(taskToEdit.project || 'Secret project');
      
      // Attempt to map back assignee profile key
      const foundKey = Object.keys(assigneeProfiles).find(
        key => assigneeProfiles[key].name === taskToEdit.assigneeName
      );
      setAssigneeId(foundKey || 'me');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');
      setTeam('Operations');
      setProject('Secret project');
      setAssigneeId('me');
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
    const selectedProfile = assigneeProfiles[assigneeId] || assigneeProfiles.me;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || undefined,
      team,
      project,
      assigneeName: selectedProfile.name,
      assigneeAvatar: selectedProfile.avatar
    };

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, taskData);
        toast.success('Task updated successfully!');
      } else {
        await createTask(taskData);
        toast.success('Task created successfully!');
      }
      onSuccess();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'An error occurred';
      toast.error(errMsg);
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
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Finish monthly reporting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <div className="error-feedback">{errors.title}</div>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Add description details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <div className="error-feedback">{errors.description}</div>
            )}
          </div>

          {/* Project & Team */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Project</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Secret project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Team</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Marketing 02"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </div>
          </div>

          {/* Status & Priority */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stage (Status)</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Not started</option>
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

          {/* Due Date & Assignee */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select
                className="form-control"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="me">Me (Sarah)</option>
                <option value="john">John Deere</option>
                <option value="sarah">Sarah Connor</option>
                <option value="david">David Smith</option>
                <option value="robert">Robert Garcia</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} style={{ borderRadius: 'var(--radius-full)' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ background: 'var(--primary)', color: 'var(--text-main)', borderRadius: 'var(--radius-full)' }}>
              {submitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
