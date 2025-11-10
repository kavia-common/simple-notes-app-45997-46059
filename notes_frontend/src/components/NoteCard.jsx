import React from 'react';

/**
 * NoteCard renders a single note in grid/list with actions.
 * Props:
 * - note: { id, title, content, tags: string[], createdAt, updatedAt, pinned, color? }
 * - onEdit: () => void
 * - onDelete: () => void
 * - onTogglePin: () => void
 */
// PUBLIC_INTERFACE
function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const date = new Date(note.updatedAt);
  const color = note.color || '#e5f0ff';

  return (
    <article className="note-card" aria-label={`Note: ${note.title || 'Untitled'}`}>
      <div className="note-color" style={{ background: color }} aria-hidden="true" />
      <header className="note-header">
        <h4 className="note-title">{note.title || 'Untitled'}</h4>
        <div className="note-actions">
          <button
            className={`pill ${note.pinned ? 'active' : ''}`}
            onClick={onTogglePin}
            aria-pressed={note.pinned ? 'true' : 'false'}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            📌
          </button>
          <button className="pill" onClick={onEdit} aria-label="Edit note" title="Edit">
            ✏️
          </button>
          <button
            className="pill danger"
            onClick={() => {
              // confirm delete
              // eslint-disable-next-line no-alert
              if (window.confirm('Delete this note? This cannot be undone.')) onDelete();
            }}
            aria-label="Delete note"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </header>
      <section className="note-body">
        <p className="note-preview">{note.content}</p>
      </section>
      <footer className="note-footer">
        <div className="tags">
          {note.tags.map((t) => (
            <span key={t} className="tag-chip">#{t}</span>
          ))}
        </div>
        <time className="muted" dateTime={date.toISOString()} title={date.toLocaleString()}>
          Updated {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </time>
      </footer>
    </article>
  );
}

export default NoteCard;
