import React from 'react';
import TaskCard from './TaskCard';
import { FiInbox } from 'react-icons/fi';

const TaskList = ({ tasks, loading, onEdit, onDelete, onClearFilters }) => {
  // If loading, show skeleton cards
  if (loading) {
    return (
      <div className="tasks-grid">
        {[1, 2, 3].map((n) => (
          <div className="skeleton-card" key={n}>
            <div className="skeleton-title"></div>
            <div className="skeleton-badge"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-footer">
              <div className="skeleton-date"></div>
              <div className="skeleton-actions">
                <div className="skeleton-action"></div>
                <div className="skeleton-action"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If list is empty, show empty state message
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <FiInbox className="empty-state-icon" />
        <h3 className="empty-state-title">No Tasks Found</h3>
        <p className="empty-state-desc">
          There are no tasks that match your criteria. Try adjusting your filters or create a new task.
        </p>
        <button className="btn-secondary" onClick={onClearFilters}>
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
