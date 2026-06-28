import React, { useState } from 'react';
import { FiInbox } from 'react-icons/fi';

const NotificationsPage = ({ notifications = [], onTaskClick }) => {
  const [activeId, setActiveId] = useState(null);

  const getInitials = (title) => {
    if (!title) return 'T';
    return title.trim().charAt(0).toUpperCase();
  };

  const getActionDesc = (action) => {
    switch (action) {
      case 'created': return 'added a new task.';
      case 'completed': return 'marked the task complete.';
      case 'deleted': return 'deleted the task.';
      case 'updated':
      default:
        return 'updated the task details.';
    }
  };

  const formatNotifTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (notifications.length === 0) {
    return (
      <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <FiInbox size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.6 }} />
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          No notifications yet.
        </p>
      </div>
    );
  }

  return (
    <div className="notifications-timeline">
      <div className="notifications-list">
        {notifications.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              className={`notification-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveId(item.id)}
            >
              <div className="notification-left">
                {/* Initials Circle (40px) */}
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#EAEAEA',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    flexShrink: 0
                  }}
                >
                  {getInitials(item.taskTitle)}
                </div>

                <div className="notification-text-box">
                  <span className="notification-task-title" style={{ fontWeight: 700, fontSize: '14px' }}>
                    {item.taskTitle}
                  </span>
                  <span className="notification-desc" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {getActionDesc(item.action)}
                  </span>
                </div>
              </div>

              {/* Timestamp on the Right */}
              <span className="notification-time">
                {formatNotifTime(item.time)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
