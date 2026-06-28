import React, { useState } from 'react';
import { FiX, FiTrash2, FiEdit2 } from 'react-icons/fi';
import PriorityBadge from './PriorityBadge';

const TaskDetailPanel = ({ task, isOpen, onClose, onDelete, onEditClick }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const { _id, title, description, status, priority, dueDate } = task;

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const getStatusLabel = (statusStr) => {
    switch (statusStr) {
      case 'in-progress': return 'in-progress';
      case 'completed': return 'completed';
      case 'not-started':
      default:
        return 'not-started';
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const confirmDelete = async () => {
    // Intercept window.confirm popup that lives in the top-level App handler
    const originalConfirm = window.confirm;
    window.confirm = () => true;
    try {
      await onDelete(_id);
    } catch (err) {
      console.error('Failed to trigger deletion handler:', err);
    } finally {
      window.confirm = originalConfirm;
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className={`task-detail-panel ${isOpen ? 'open' : ''}`} style={{ width: '400px' }}>
      <div>
        {/* Header: Title + Close Button */}
        <div className="detail-header">
          <h2 className="detail-title">{title}</h2>
          <button className="detail-close-btn" onClick={handleClose} aria-label="Close panel">
            <FiX />
          </button>
        </div>

        {/* Fields Vertically */}
        <div className="detail-fields">
          {/* Deadline */}
          <div className="detail-field">
            <span className="detail-field-label">Deadline</span>
            <span className="detail-field-value">
              {formatDate(dueDate)}
            </span>
          </div>

          {/* Priority */}
          <div className="detail-field">
            <span className="detail-field-label">Priority</span>
            <span className="detail-field-value">
              <PriorityBadge priority={priority} />
            </span>
          </div>

          {/* Status */}
          <div className="detail-field">
            <span className="detail-field-label">Status</span>
            <span className="detail-field-value" style={{ textTransform: 'lowercase' }}>
              {getStatusLabel(status)}
            </span>
          </div>
        </div>

        {/* Description Box */}
        <div className="detail-desc-box">
          <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--text-primary)' }}>Description</strong>
          {description ? description : <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No description</span>}
        </div>
      </div>

      {/* Action Buttons or Custom In-UI delete confirmation box */}
      {showDeleteConfirm ? (
        <div style={{ background: '#FFF5F5', border: '1px solid #FFCCCC', borderRadius: '8px', padding: '16px', margin: '16px' }}>
          <p style={{ fontSize: '14px', color: '#C0392B', marginBottom: '12px' }}>Are you sure you want to delete this task?</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button 
              onClick={cancelDelete}
              style={{ padding: '6px 16px', borderRadius: '999px', border: '1px solid #D2D2D2', background: 'transparent', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete} 
              style={{ background: '#FFEBEB', color: '#C0392B', padding: '6px 16px', borderRadius: '999px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Yes, delete
            </button>
          </div>
        </div>
      ) : (
        <div className="detail-actions">
          <button 
            className="btn-archive" 
            onClick={() => onEditClick(task)}
            title="Edit details"
          >
            <FiEdit2 />
            <span>Edit</span>
          </button>
          <button 
            className="btn-delete" 
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete task"
          >
            <FiTrash2 />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPanel;
