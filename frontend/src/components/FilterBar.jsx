import React from 'react';
import { FiSearch, FiRotateCcw } from 'react-icons/fi';

const FilterBar = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  sortBy,
  setSortBy,
  onClear
}) => {
  return (
    <div className="filters-bar">
      <div className="filters-left">
        {/* Title Client-side Search Input */}
        <div className="search-input-wrapper">
          <FiSearch />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          className="select-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          className="select-filter"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Sort By Dropdown */}
        <select
          className="select-filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Created: Newest</option>
          <option value="oldest">Created: Oldest</option>
          <option value="due-soon">Due Date: Soonest</option>
          <option value="due-late">Due Date: Latest</option>
        </select>
      </div>

      <div className="filters-right">
        {/* Clear Filters Button */}
        <button className="clear-btn" onClick={onClear}>
          <FiRotateCcw />
          <span>Clear Filters</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
