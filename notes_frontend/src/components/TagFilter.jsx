import React, { useMemo } from 'react';

/**
 * TagFilter shows a list of tags with checkboxes to filter notes.
 * - tags: string[]
 * - active: string[]
 * - onChange: (next: string[]) => void
 */
// PUBLIC_INTERFACE
function TagFilter({ tags, active, onChange }) {
  const sorted = useMemo(() => [...tags].sort((a, b) => a.localeCompare(b)), [tags]);

  const toggle = (t) => {
    if (active.includes(t)) {
      onChange(active.filter((x) => x !== t));
    } else {
      onChange([...active, t]);
    }
  };

  if (!sorted.length) {
    return (
      <div className="tag-filter empty">
        <div className="tag-filter-header">
          <h3>Tags</h3>
          <button className="link" aria-disabled disabled>Clear</button>
        </div>
        <p className="muted">No tags yet</p>
      </div>
    );
  }

  return (
    <div className="tag-filter">
      <div className="tag-filter-header">
        <h3>Tags</h3>
        <button
          className="link"
          onClick={() => onChange([])}
          aria-label="Clear tag filters"
        >
          Clear
        </button>
      </div>
      <ul className="tag-list" role="list">
        {sorted.map((tag) => (
          <li key={tag} className="tag-item">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={active.includes(tag)}
                onChange={() => toggle(tag)}
                aria-checked={active.includes(tag)}
              />
              <span className="tag-chip">#{tag}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TagFilter;
