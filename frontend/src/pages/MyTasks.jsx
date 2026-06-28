import React from 'react';
import TaskRow from '../components/TaskRow';
import { FiInbox } from 'react-icons/fi';

const MyTasks = ({ tasks = [], loading, onTaskClick, onToggleComplete, onTaskModified }) => {
  
  // Group tasks dynamically using the exact specified logic
  const getGroupedTasks = () => {
    const overdueGroup = [];
    const todayGroup = [];
    const tomorrowGroup = [];
    const weekGroup = [];
    const laterGroup = [];

    const today = new Date(); 
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today); 
    tomorrow.setDate(today.getDate() + 1);

    const nextWeek = new Date(today); 
    nextWeek.setDate(today.getDate() + 7);

    const getGroup = (task) => {
      if (!task.dueDate) return 'later';
      const d = new Date(task.dueDate); 
      d.setHours(0, 0, 0, 0);
      if (d.getTime() === today.getTime())    return 'today';
      if (d.getTime() === tomorrow.getTime()) return 'tomorrow';
      if (d > today && d <= nextWeek)         return 'thisWeek';
      if (d < today)                          return 'overdue';
      return 'later';
    };

    tasks.forEach((task) => {
      const group = getGroup(task);
      if (group === 'overdue') {
        overdueGroup.push(task);
      } else if (group === 'today') {
        todayGroup.push(task);
      } else if (group === 'tomorrow') {
        tomorrowGroup.push(task);
      } else if (group === 'thisWeek') {
        weekGroup.push(task);
      } else {
        laterGroup.push(task);
      }
    });

    // Sort tasks within each group by createdAt descending
    const sortFn = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
    overdueGroup.sort(sortFn);
    todayGroup.sort(sortFn);
    tomorrowGroup.sort(sortFn);
    weekGroup.sort(sortFn);
    laterGroup.sort(sortFn);

    return { overdueGroup, todayGroup, tomorrowGroup, weekGroup, laterGroup };
  };

  const { overdueGroup, todayGroup, tomorrowGroup, weekGroup, laterGroup } = getGroupedTasks();

  const renderTableSection = (title, groupList) => {
    if (groupList.length === 0) return null; // Only render if it has at least 1 task

    return (
      <div className="tasks-table-card" style={{ marginBottom: '24px' }}>
        <h3 className="task-section-header">{title}</h3>
        <table className="task-table">
          <thead>
            <tr>
              <th style={{ width: '45%' }}>Task</th>
              <th style={{ width: '20%' }}>Due Date</th>
              <th style={{ width: '15%' }}>Stage</th>
              <th style={{ width: '20%' }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {groupList.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                onRowClick={onTaskClick}
                onToggleComplete={onToggleComplete}
                onTaskModified={onTaskModified}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Loading tasks...</p>
      </div>
    );
  }

  const hasTasks = 
    overdueGroup.length > 0 ||
    todayGroup.length > 0 || 
    tomorrowGroup.length > 0 || 
    weekGroup.length > 0 || 
    laterGroup.length > 0;

  if (!hasTasks) {
    return (
      <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <FiInbox size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.6 }} />
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          No tasks yet. Click '+ New task' to get started.
        </p>
      </div>
    );
  }

  return (
    <section className="my-tasks-container">
      {renderTableSection('Overdue', overdueGroup)}
      {renderTableSection('Today', todayGroup)}
      {renderTableSection('Tomorrow', tomorrowGroup)}
      {renderTableSection('This week', weekGroup)}
      {renderTableSection('Later', laterGroup)}
    </section>
  );
};

export default MyTasks;
