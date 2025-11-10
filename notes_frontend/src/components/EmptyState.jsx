import React from 'react';

/**
 * EmptyState renders when there are no notes (or no matches).
 * Props:
 * - onCreate: () => void
 */
// PUBLIC_INTERFACE
function EmptyState({ onCreate }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-card">
        <div className="icon">🗒️</div>
        <h3>No notes yet</h3>
        <p className="muted">Create your first note to get started.</p>
        <button className="btn-primary" onClick={onCreate} aria-label="Create your first note">
          New Note
        </button>
      </div>
    </div>
  );
}

export default EmptyState;
