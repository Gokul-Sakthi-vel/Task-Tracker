import React from 'react';

const PriorityBadge = ({ priority }) => {
  const getLabelAndClass = (priorityStr) => {
    switch (priorityStr) {
      case 'high':
        return { label: 'High', className: 'high' };
      case 'medium':
        return { label: 'Medium', className: 'medium' };
      case 'low':
      default:
        return { label: 'Low', className: 'low' };
    }
  };

  const { label, className } = getLabelAndClass(priority);

  return (
    <span className={`badge-pill badge-priority ${className}`}>
      {label}
    </span>
  );
};

export default PriorityBadge;
