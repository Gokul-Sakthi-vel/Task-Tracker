import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLayout, FiCheckSquare, FiBell, FiX } from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <FiLayout /> },
    { name: 'My tasks', path: '/tasks', icon: <FiCheckSquare /> },
    { name: 'Notifications', path: '/notifications', icon: <FiBell /> }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) {
      onClose(); // Close sidebar overlay on navigation (mobile)
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-top">
        {/* App Logo */}
        <div className="sidebar-logo">
          <img src="/logo.png" alt="TaskTracker" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <span className="logo-text">TaskTracker</span>
          
          {/* Close button visible only on Mobile */}
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            <FiX />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.name}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
                title={item.name}
              >
                {item.icon}
                <span className="sidebar-item-text">{item.name}</span>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
