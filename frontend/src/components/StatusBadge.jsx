import React from 'react';
import { updateTask } from '../api/taskApi';
import { toast } from 'react-toastify';

const StatusBadge = ({ status, taskId, onStatusChange }) => {
  if (status === 'completed') {
    return null; // Show strikethrough on title instead of a badge
  }

  const handleCycleStatus = async (e) => {
    e.stopPropagation(); // Avoid opening detail panel
    if (!taskId || !onStatusChange) return;

    // Cycle between pending (not-started) and in-progress
    const nextStatus = status === 'pending' ? 'in-progress' : 'completed';

    try {
      await updateTask(taskId, { status: nextStatus });
      toast.success(`Task stage updated to: ${nextStatus === 'completed' ? 'completed' : nextStatus}`);
      onStatusChange();
    } catch (err) {
      toast.error('Failed to change status: ' + err.message);
    }
  };

  const isPending = status === 'pending';
  const label = isPending ? 'Not started' : 'In progress';
  const className = isPending ? 'not-started' : 'in-progress';

  return (
    <span
      className={`badge-pill badge-status ${className}`}
      onClick={handleCycleStatus}
      title="Click to advance stage"
    >
      {label}
    </span>
  );
};

export default StatusBadge;
