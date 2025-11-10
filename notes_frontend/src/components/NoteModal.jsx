import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * NoteModal - Accessible modal for creating or editing notes.
 * Props:
 * - open: boolean
 * - initial: note object or null
 * - onSubmit: (notePatch) => void   // title, content, tags[], color, pinned
 * - onCancel: () => void
 */
// PUBLIC_INTERFACE
function NoteModal({ open, initial, onSubmit, onCancel }) {
  const firstFieldRef = useRef(null);
  const modalRef = useRef(null);

  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const [tags, setTags] = useState((initial?.tags || []).join(', '));
  const [pinned, setPinned] = useState(!!initial?.pinned);
  const [color, setColor] = useState(initial?.color || '#e5f0ff');

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '');
      setContent(initial?.content || '');
      setTags((initial?.tags || []).join(', '));
      setPinned(!!initial?.pinned);
      setColor(initial?.color || '#e5f0ff');
      setTimeout(() => {
        firstFieldRef.current?.focus();
      }, 0);
    }
  }, [open, initial]);

  // Focus trap and ESC to close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCancel();
      } else if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, [open, onCancel]);

  const isValid = useMemo(() => title.trim().length > 0 || content.trim().length > 0, [title, content]);

  const onSubmitInternal = (e) => {
    e.preventDefault();
    if (!isValid) return;
    const normalizedTags = tags
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i);
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      tags: normalizedTags,
      pinned,
      color,
    });
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-modal-title"
        aria-describedby="note-modal-desc"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h3 id="note-modal-title">{initial ? 'Edit note' : 'New note'}</h3>
          <button className="pill" onClick={onCancel} aria-label="Close modal">✖</button>
        </header>
        <p id="note-modal-desc" className="sr-only">
          Use this form to {initial ? 'edit' : 'create'} a note. Press Escape to close.
        </p>

        <form onSubmit={onSubmitInternal}>
          <div className="form-row">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              ref={firstFieldRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
          </div>

          <div className="form-row">
            <label htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
            />
          </div>

          <div className="form-row">
            <label htmlFor="note-tags">Tags (comma-separated)</label>
            <input
              id="note-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, ideas, todo"
            />
          </div>

          <div className="form-row inline">
            <label htmlFor="note-color">Color</label>
            <input
              id="note-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Note color"
            />
            <label className="checkbox ml-12">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
              />
              <span>Pin note</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!isValid}>
              {initial ? 'Save changes' : 'Create note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;
