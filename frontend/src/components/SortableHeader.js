import React from 'react';

const SortableHeader = ({ label, field, sortBy, sortOrder, onSort }) => {
  const isActive = sortBy === field;
  return (
    <th onClick={() => onSort(field)} style={{ cursor: 'pointer', userSelect: 'none' }}>
      <span style={{ color: isActive ? 'var(--accent)' : undefined }}>
        {label}{' '}
        {isActive ? (sortOrder === 'ASC' ? '↑' : '↓') : <span style={{ opacity: 0.3 }}>↕</span>}
      </span>
    </th>
  );
};

export default SortableHeader;
