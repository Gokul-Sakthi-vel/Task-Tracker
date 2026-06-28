import React from 'react';
import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { title, description, status, priority, dueDate } = task;

  // Class assignment based on status
  const getStatusBadgeClass = (statusStr) => {
    switch (statusStr) {
      case 'pending': return 'badge-status-pending';
      case 'in-progress': return 'badge-status-in-progress';
      case 'completed': return 'badge-status-completed';
      default: return '';
    }
  };

  // Class assignment based on priority
  const getPriorityBadgeClass = (priorityStr) => {
    switch (priorityStr) {
      case 'low': return 'badge-priority-low';
      case 'medium': return 'badge-priority-medium';
      case 'high': return 'badge-priority-high';
      default: return '';
    }
  };

  // Determine if due date has passed, is today, or is in the future
  const getDueDateClass = (dateString) => {
    if (!dateString) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);

    if (due < today) {
      return 'overdue';
    } else if (due.getTime() === today.getTime()) {
      return 'today';
    }
    return '';
  };

  // Format date display
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    // Use UTC date parameters to avoid offset issues
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const dueDateClass = getDueDateClass(dueDate);

  return (
    <div className="task-card">
      <div>
        <div className="task-card-header">
          <h3 className="task-card-title" title={title}>{title}</h3>
        </div>

        <div className="badge-wrapper">
          <span className={`badge ${getStatusBadgeClass(status)}`}>
            {status}
          </span>
          <span className={`badge ${getPriorityBadgeClass(priority)}`}>
            {priority}
          </span>
        </div>

        <p className="task-card-description" title={description}>
          {description || 'No description provided.'}
        </p>
      </div>

      <div className="task-card-footer">
        <div className={`task-due-date ${dueDateClass}`}>
          <FiCalendar />
          <span>{formatDate(dueDate)}</span>
        </div>

        <div className="task-card-actions">
          <button 
            className="action-btn" 
            title="Edit Task"
            onClick={() => onEdit(task)}
          >
            <FiEdit2 size={14} />
          </button>
          <button 
            className="action-btn delete-btn" 
            title="Delete Task"
            onClick={() => onDelete(task._id)}
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
