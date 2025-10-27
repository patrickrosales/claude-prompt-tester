import React, { useState, useCallback } from 'react';
import ComparisonColumn from './ComparisonColumn';

/**
 * ComparisonGrid - Container for multiple comparison columns
 * Allows adding/removing columns and manages the grid layout
 */
export function ComparisonGrid({ initialColumns = 2 }) {
  const [columnCount, setColumnCount] = useState(initialColumns);

  const addColumn = useCallback(() => {
    if (columnCount < 4) {
      setColumnCount(columnCount + 1);
    }
  }, [columnCount]);

  const removeColumn = useCallback(() => {
    if (columnCount > 1) {
      setColumnCount(columnCount - 1);
    }
  }, [columnCount]);

  const columns = Array.from({ length: columnCount }, (_, i) => i + 1);

  return (
    <div>
      <div style={{ padding: '0 1.5rem', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={removeColumn}
            disabled={columnCount === 1}
            className="btn-secondary btn-sm"
            title="Remove comparison column"
          >
            - Remove Column
          </button>
          <button
            onClick={addColumn}
            disabled={columnCount === 4}
            className="btn-secondary btn-sm"
            title="Add comparison column"
          >
            + Add Column
          </button>
          <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            {columnCount} column{columnCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="comparison-grid">
        {columns.map((columnId) => (
          <ComparisonColumn key={columnId} columnId={columnId} />
        ))}
      </div>
    </div>
  );
}

export default ComparisonGrid;
