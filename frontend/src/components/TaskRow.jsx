import React from 'react';
import { FiCheck } from 'react-icons/fi';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const TaskRow = ({ task, onRowClick, onToggleComplete, onTaskModified }) => {
  const { _id, title, status, priority, dueDate } = task;

  const isCompleted = status === 'completed';

  // Format Due Date Label & highlight Today/Tomorrow
  const getDueDateLabelAndStyle = (dateString) => {
    if (!dateString) return { label: 'No due date', isYellow: false };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { label: 'Today', isYellow: true };
    if (diffDays === 1) return { label: 'Tomorrow', isYellow: true };
    if (diffDays > 1 && diffDays < 7) {
      return { 
        label: due.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }), 
        isYellow: false 
      };
    }
    return {
      label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      isYellow: false
    };
  };

  const { label: dueDateLabel, isYellow } = getDueDateLabelAndStyle(dueDate);
  const dateClass = isYellow ? 'today' : '';

  const handleCheckboxClick = (e) => {
    e.stopPropagation(); // Avoid opening detail panel
    const nextStatus = isCompleted ? 'not-started' : 'completed';
    onToggleComplete(_id, nextStatus);
  };

  return (
    <tr className="task-row" onClick={() => onRowClick(task)}>
      {/* Checkbox + Title Area (TASK column) */}
      <td className="task-title-cell">
        <div 
          className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={handleCheckboxClick}
          title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
        >
          {isCompleted && <FiCheck />}
        </div>
        <div className="task-text-block" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className={`task-text ${isCompleted ? 'completed' : ''}`}>
            {title}
          </span>
          {/* Mobile-only Subtitle Info Card Layout */}
          <div className="mobile-task-meta">
            <span className={`due-date-text ${dateClass}`}>
              {dueDateLabel}
            </span>
            <StatusBadge 
              status={status} 
              taskId={_id} 
              onStatusChange={onTaskModified} 
            />
          </div>
        </div>
      </td>

      {/* Due Date Column */}
      <td>
        <span className={`due-date-text ${dateClass}`}>
          {dueDateLabel}
        </span>
      </td>

      {/* Stage Column */}
      <td>
        <StatusBadge 
          status={status} 
          taskId={_id} 
          onStatusChange={onTaskModified} 
        />
      </td>

      {/* Priority Column */}
      <td>
        <PriorityBadge priority={priority} />
      </td>
    </tr>
  );
};

export default TaskRow;
