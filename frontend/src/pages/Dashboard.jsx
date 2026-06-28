import React, { useState } from 'react';
import { FiCheck, FiInbox, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Dashboard = ({ tasks = [], loading, onTaskClick, onToggleComplete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // 'YYYY-MM-DD'

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar grid (Week starts on Monday)
  const getCalendarMonthGrid = (year, month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const firstDay = new Date(year, month, 1);
    // Align Monday=0, Tuesday=1, ..., Sunday=6
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    const grid = [];
    
    // Padding from previous month
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const prevDate = new Date(Date.UTC(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, dayNum));
      grid.push({
        num: dayNum,
        muted: true,
        dateString: prevDate.toISOString().split('T')[0]
      });
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= totalDays; i++) {
      const currDate = new Date(Date.UTC(year, month, i));
      const dateStr = currDate.toISOString().split('T')[0];
      const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      grid.push({
        num: i,
        muted: false,
        isToday,
        dateString: dateStr
      });
    }
    
    // Next month padding (complete grid of 42 cells)
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(Date.UTC(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, i));
      grid.push({
        num: i,
        muted: true,
        dateString: nextDate.toISOString().split('T')[0]
      });
    }

    return { grid, label: `${monthNames[month]} ${year}` };
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const { grid: daysInMonth, label: headerLabel } = getCalendarMonthGrid(year, month);

  // Toggle date selection
  const handleDateClick = (day) => {
    if (selectedDate === day.dateString) {
      setSelectedDate(null); // Deselect
    } else {
      setSelectedDate(day.dateString); // Select
    }
  };

  // Due label helper for compact task rows
  const getDueDateLabel = (dateString) => {
    if (!dateString) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);
    const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff > 1 && diff < 7) return 'This week';
    return '';
  };

  // Determine tasks to display (max 8)
  const getDisplayTasks = () => {
    let result = [...tasks];

    // Filter by selected date if active
    if (selectedDate) {
      result = result.filter((task) => {
        if (!task.dueDate) return false;
        const taskDateStr = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDateStr === selectedDate;
      });
    }

    // Sort: active tasks first, then completed. Max 8 items.
    const active = result.filter(t => t.status !== 'completed');
    const completed = result.filter(t => t.status === 'completed');
    return [...active, ...completed].slice(0, 8);
  };

  const displayTasks = getDisplayTasks();
  const activeTasksCount = tasks.filter(t => t.status !== 'completed').length;

  const handleCheckboxClick = (e, task) => {
    e.stopPropagation();
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    onToggleComplete(task._id, nextStatus);
  };

  // Cell style generator complying with Today rounded rectangle and Selected outline specs
  const getCellStyle = (day) => {
    const isSelected = selectedDate === day.dateString;
    
    let style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      height: '36px',
      width: '36px',
      margin: 'auto',
      transition: 'var(--transition)'
    };

    if (day.isToday) {
      style = {
        ...style,
        background: '#F5C518',
        color: '#1A1A1A',
        fontWeight: '600',
        borderRadius: '6px'
      };
    }
    
    if (isSelected) {
      style = {
        ...style,
        border: '2px solid #F5C518',
        borderRadius: '6px',
        background: day.isToday ? '#F5C518' : 'transparent'
      };
    }

    return style;
  };

  return (
    <div className="dashboard-grid">
      {/* LEFT COLUMN: Calendar Widget */}
      <div className="widget-card">
        <div className="calendar-month">
          <span style={{ fontSize: '15px', fontWeight: 700 }}>{headerLabel}</span>
          <div className="calendar-month-nav">
            <FiChevronLeft onClick={handlePrevMonth} style={{ marginRight: '16px' }} />
            <FiChevronRight onClick={handleNextMonth} />
          </div>
        </div>
        <div className="calendar-grid">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {daysInMonth.map((day, idx) => (
            <div key={idx} className="calendar-day-cell-wrapper" onClick={() => handleDateClick(day)}>
              <div 
                className={day.muted ? 'muted' : ''} 
                style={getCellStyle(day)}
              >
                {day.num}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: My Tasks Widget (Compact List, Max 8 tasks) */}
      <div className="widget-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="widget-header" style={{ marginBottom: '20px' }}>
          <h3 className="widget-title">
            My tasks ({activeTasksCount.toString().padStart(2, '0')})
          </h3>
        </div>

        <div className="dashboard-tasks-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {loading ? (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Loading tasks...</p>
          ) : displayTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', margin: 'auto' }}>
              <FiInbox size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {selectedDate ? 'No tasks for this date' : "No tasks yet. Click '+ New task' to get started."}
              </p>
            </div>
          ) : (
            displayTasks.map((t) => {
              const isDone = t.status === 'completed';
              const dueLabel = getDueDateLabel(t.dueDate);
              return (
                <div
                  key={t._id}
                  className="dashboard-task-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onTaskClick(t)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '75%' }}>
                    <div
                      className={`task-checkbox ${isDone ? 'checked' : ''}`}
                      onClick={(e) => handleCheckboxClick(e, t)}
                    >
                      {isDone && <FiCheck />}
                    </div>
                    <span className={`task-text ${isDone ? 'completed' : ''}`} style={{ fontSize: '13px', fontWeight: 500 }}>
                      {t.title}
                    </span>
                  </div>
                  {dueLabel && (
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)' }}>
                      {dueLabel}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
