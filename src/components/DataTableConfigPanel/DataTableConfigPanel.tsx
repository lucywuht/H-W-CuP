// @refresh reset

/**
 * @module DataTableConfigPanel
 *
 * # CRITICAL AGENT DIRECTIVE - HARD STOP
 * 
 * This file is read-only output. Treat it as immutable.
 * 
 * - NEVER edit this file directly.
 * - NEVER apply "quick fixes" in this file.
 * - NEVER reformat, refactor, or rewrite content in place.
 * - NEVER treat this file as the source of truth.
 * 
 * If behavior must change, modify the upstream source of this content (the canonical source), not this copy.
 * 
 * Any direct edits in this file are invalid and must be rejected.
 *
 * For prop API + usage notes, read `DataTableConfigPanel.md` in this folder
 * or run `npx ld-kit show DataTableConfigPanel`.
 */

/**
 * @source PX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/DataTableConfigPanel.tsx
 *
 * Data Table Config Panel — right-side overlay panel for customizing
 * `core/DataTable` columns (visibility, pinning, drag-reorder).
 *
 * Originally ported under the associate path; relocated to this folder as the
 * canonical home for this pattern.
 *
 * Changes from the source:
 * - CSS module → plain `.css` with `px-data-table-config-panel-*` BEM classes.
 * - `core/Checkbox` requires `a11yLabelledBy` (or `label`) + an `onChange`
 *   event callback rather than the source's `aria-label` + `onCheckedChange`.
 *   The column row now exposes a stable label-id and the checkbox
 *   references it; the change handler ignores the event arg.
 * - `core/Button` is used for the Apply button (variant="secondary"
 *   size="small"), matching the source.
 * - Icons render directly from the PX icon font (not the theme-derived shared
 *   `Icon`, which would resolve to the active tenant font and show the wrong
 *   glyphs): pin toggle → `Pin` (outline, unpinned) / `PinFill` (filled,
 *   pinned), close → `Close`. The PX font CSS is imported below so these
 *   glyphs render regardless of the active theme. The drag-handle uses the
 *   inline six-dot grip SVG from the PX source (the PX `Drag` glyph is a
 *   drag-and-drop cursor, not a reorder grip).
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Button} from '../Button/Button';
import {Checkbox} from '../Checkbox/Checkbox';

import '../../fonts/px/font.css';
import './DataTableConfigPanel.css';

export interface DataTableColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  /** Frozen / pinned to the left. */
  pinned: boolean;
  /** Cannot be hidden (e.g. "Campaign"). */
  alwaysVisible?: boolean;
  /** Always pinned and cannot be changed (e.g. "Actions"). */
  alwaysPinned?: boolean;
}

export interface DataTableConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** @default 'Customize Columns' */
  title?: string;
  columns: DataTableColumnConfig[];
  onApply: (columns: DataTableColumnConfig[]) => void;
  /** Optional className applied to the panel root. */
  className?: string;
}

/** PX icon-font glyph. Rendered directly (not via the themed shared `Icon`) so
 *  this PX pattern always shows the PX glyphs regardless of the active tenant. */
const PxIcon = ({name, size}: {name: string; size: 'small' | 'medium'}) => (
  <i
    className={`px px-${name}`}
    aria-hidden
    style={{fontSize: size === 'small' ? '1rem' : '1.5rem', lineHeight: 1}}
  />
);

/** Six-dot grip grabber. The PX `Drag` font glyph is a drag-and-drop cursor,
 *  not a reorder grip, so this uses the inline grip SVG from the PX source. */
const DragHandleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M10.5 6C10.5 6.82843 9.82843 7.5 9 7.5C8.17157 7.5 7.5 6.82843 7.5 6C7.5 5.17157 8.17157 4.5 9 4.5C9.82843 4.5 10.5 5.17157 10.5 6Z" fill="currentColor" />
    <path d="M10.5 12C10.5 12.8284 9.82843 13.5 9 13.5C8.17157 13.5 7.5 12.8284 7.5 12C7.5 11.1716 8.17157 10.5 9 10.5C9.82843 10.5 10.5 11.1716 10.5 12Z" fill="currentColor" />
    <path d="M10.5 18C10.5 18.8284 9.82843 19.5 9 19.5C8.17157 19.5 7.5 18.8284 7.5 18C7.5 17.1716 8.17157 16.5 9 16.5C9.82843 16.5 10.5 17.1716 10.5 18Z" fill="currentColor" />
    <path d="M16.5 6C16.5 6.82843 15.8284 7.5 15 7.5C14.1716 7.5 13.5 6.82843 13.5 6C13.5 5.17157 14.1716 4.5 15 4.5C15.8284 4.5 16.5 5.17157 16.5 6Z" fill="currentColor" />
    <path d="M16.5 12C16.5 12.8284 15.8284 13.5 15 13.5C14.1716 13.5 13.5 12.8284 13.5 12C13.5 11.1716 14.1716 10.5 15 10.5C15.8284 10.5 16.5 11.1716 16.5 12Z" fill="currentColor" />
    <path d="M16.5 18C16.5 18.8284 15.8284 19.5 15 19.5C14.1716 19.5 13.5 18.8284 13.5 18C13.5 17.1716 14.1716 16.5 15 16.5C15.8284 16.5 16.5 17.1716 16.5 18Z" fill="currentColor" />
  </svg>
);

const PinIcon = () => <PxIcon name="Pin" size="small" />;

const PinFillIcon = () => <PxIcon name="PinFill" size="small" />;

const CloseIcon = () => <PxIcon name="Close" size="medium" />;

export function DataTableConfigPanel({
  isOpen,
  onClose,
  title = 'Customize Columns',
  columns,
  onApply,
  className,
}: DataTableConfigPanelProps) {
  const [localColumns, setLocalColumns] =
    React.useState<DataTableColumnConfig[]>(columns);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const labelIdPrefix = React.useId();

  React.useEffect(() => {
    if (isOpen) setLocalColumns(columns);
  }, [isOpen, columns]);

  if (!isOpen) return null;

  const totalCount = localColumns.length;
  const visibleCount = localColumns.filter((c) => c.visible).length;

  const handleSelectAll = () => {
    setLocalColumns((cols) => cols.map((c) => ({...c, visible: true})));
  };

  const handleClearSelected = () => {
    setLocalColumns((cols) =>
      cols.map((c) =>
        c.alwaysVisible || c.alwaysPinned
          ? c
          : {...c, visible: false, pinned: false},
      ),
    );
  };

  const handleToggleVisible = (id: string) => {
    setLocalColumns((cols) =>
      cols.map((c) =>
        c.id === id
          ? {...c, visible: !c.visible, pinned: !c.visible ? c.pinned : false}
          : c,
      ),
    );
  };

  const handleTogglePinned = (id: string) => {
    setLocalColumns((cols) =>
      cols.map((c) => (c.id === id ? {...c, pinned: !c.pinned} : c)),
    );
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const next = [...localColumns];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    const alwaysVis = next.filter((c) => c.alwaysVisible);
    const alwaysPin = next.filter((c) => c.alwaysPinned);
    const rest = next.filter((c) => !c.alwaysVisible && !c.alwaysPinned);
    setLocalColumns([...alwaysVis, ...rest, ...alwaysPin]);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleApply = () => {
    onApply(localColumns);
    onClose();
  };

  const handleCancel = () => {
    setLocalColumns(columns);
    onClose();
  };

  return (
    <div
      className="px-data-table-config-panel__overlay"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cx('px-data-table-config-panel', className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-data-table-config-panel__header">
          <h2 className="px-data-table-config-panel__title">{title}</h2>
          <button
            type="button"
            className="px-data-table-config-panel__close-button"
            onClick={handleCancel}
            aria-label="Close panel"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-data-table-config-panel__divider" aria-hidden />

        <div className="px-data-table-config-panel__content">
          <div className="px-data-table-config-panel__actions-row">
            <button
              type="button"
              className="px-data-table-config-panel__link-button"
              onClick={handleSelectAll}
            >
              Select all ({totalCount})
            </button>
            <button
              type="button"
              className="px-data-table-config-panel__link-button"
              onClick={handleClearSelected}
            >
              Clear selected ({visibleCount})
            </button>
          </div>

          <div className="px-data-table-config-panel__column-list">
            {localColumns.map((col, index) => {
              const isDragging = dragIndex === index;
              const isDragOver = dragOverIndex === index && dragIndex !== index;
              const canDrag =
                !col.alwaysVisible && !col.alwaysPinned && col.visible;
              const labelId = `${labelIdPrefix}-${col.id}`;
              const labelDisabled = !!(col.alwaysVisible || col.alwaysPinned);

              return (
                <div
                  key={col.id}
                  className={cx(
                    'px-data-table-config-panel__column-row',
                    isDragging &&
                      'px-data-table-config-panel__column-row--dragging',
                    isDragOver &&
                      'px-data-table-config-panel__column-row--drag-over',
                  )}
                  draggable={canDrag}
                  onDragStart={canDrag ? () => handleDragStart(index) : undefined}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="px-data-table-config-panel__column-row-left">
                    <Checkbox
                      checked={col.visible}
                      disabled={labelDisabled}
                      a11yLabelledBy={labelId}
                      onChange={() => {
                        if (!labelDisabled) handleToggleVisible(col.id);
                      }}
                    />
                    <span
                      id={labelId}
                      className={cx(
                        'px-data-table-config-panel__column-label',
                        labelDisabled &&
                          'px-data-table-config-panel__column-label--disabled',
                      )}
                    >
                      {col.label}
                    </span>
                  </div>

                  <div className="px-data-table-config-panel__column-row-right">
                    {col.alwaysPinned ? (
                      <span
                        className="px-data-table-config-panel__pin-button px-data-table-config-panel__pin-button--active"
                        aria-label="Always pinned"
                      >
                        <PinFillIcon />
                      </span>
                    ) : col.visible ? (
                      <button
                        type="button"
                        className={cx(
                          'px-data-table-config-panel__pin-button',
                          col.pinned &&
                            'px-data-table-config-panel__pin-button--active',
                        )}
                        onClick={() => handleTogglePinned(col.id)}
                        aria-label={
                          col.pinned
                            ? `Unpin ${col.label}`
                            : `Pin ${col.label} column`
                        }
                        title={
                          col.pinned
                            ? `Unpin ${col.label}`
                            : `Pin ${col.label} to left`
                        }
                      >
                        {col.pinned ? <PinFillIcon /> : <PinIcon />}
                      </button>
                    ) : (
                      <span className="px-data-table-config-panel__pin-button-spacer" />
                    )}

                    <span
                      className={cx(
                        'px-data-table-config-panel__drag-handle',
                        !canDrag &&
                          'px-data-table-config-panel__drag-handle--hidden',
                      )}
                      aria-hidden
                    >
                      <DragHandleIcon />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-data-table-config-panel__divider" aria-hidden />

        <div className="px-data-table-config-panel__footer">
          <button
            type="button"
            className="px-data-table-config-panel__link-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <Button variant="secondary" size="small" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

DataTableConfigPanel.displayName = 'DataTableConfigPanel';
