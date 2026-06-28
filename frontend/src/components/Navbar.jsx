import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiPlus, FiArrowLeft } from 'react-icons/fi';

const Navbar = ({ searchQuery, setSearchQuery, onNewTaskClick, onHamburgerClick }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const location = useLocation();

  // Show search bar strictly on "/tasks" (My Tasks page)
  const showSearch = location.pathname === '/tasks';

  return (
    <header className="navbar-top">
      {/* Expanded Search View on Mobile (Only active if showSearch is true) */}
      {showSearch && isSearchExpanded ? (
        <div className="mobile-search-expanded-container" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
          <button 
            type="button" 
            className="navbar-back-btn" 
            onClick={() => setIsSearchExpanded(false)}
            aria-label="Back"
            style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
          >
            <FiArrowLeft />
          </button>
          <div className="search-container expanded" style={{ flex: 1, margin: 0 }}>
            <FiSearch />
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      ) : (
        <>
          {/* Left Area: Hamburger + Search Input/Icon */}
          <div className="navbar-left-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            {/* Hamburger Button (visible only below 768px) */}
            <button 
              type="button" 
              className="hamburger-btn" 
              onClick={onHamburgerClick}
              aria-label="Open menu"
            >
              <FiMenu />
            </button>

            {/* Desktop / Tablet Search Bar */}
            {showSearch && (
              <div className="search-container desktop-only-search">
                <FiSearch />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {/* Magnifier Button (visible only below 768px) */}
            {showSearch && (
              <button 
                type="button" 
                className="mobile-search-trigger-btn" 
                onClick={() => setIsSearchExpanded(true)}
                aria-label="Search"
              >
                <FiSearch />
              </button>
            )}
          </div>

          {/* Right Area: New Task button */}
          <div className="nav-actions">
            <button className="btn-new-task" onClick={onNewTaskClick} aria-label="New task">
              <FiPlus className="plus-icon" />
              <span className="btn-new-task-text">New task</span>
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
