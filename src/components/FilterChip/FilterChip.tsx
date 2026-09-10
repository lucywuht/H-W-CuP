// @refresh reset

/**
 * @module FilterChip
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
 * For prop API + usage notes, read `FilterChip.md` in this folder
 * or run `npx ld-kit show FilterChip`.
 */

/**
 * @source PX
 *
 * FilterChip — Living Design 3.5 / PX
 *
 * Interactive, selectable pill-shaped toggle buttons for filtering.
 * Exposes selected state via `aria-pressed` and uses the FILTER semantic
 * token family. Three variants: Toggle, Multi-Select, All Filters.
 */
import * as React from 'react';
import './FilterChip.css';

/* -------------------------------------------------------------------------- */
/*  Inline SVG icons (copied from LD-PX-Starter-Kit icons/)                  */
/* -------------------------------------------------------------------------- */

function SlidersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M10.5 8C11.8807 8 13 9.11929 13 10.5V11H15V12H13V12.5C13 13.8807 11.8807 15 10.5 15C9.11929 15 8 13.8807 8 12.5V12H1V11H8V10.5C8 9.11929 9.11929 8 10.5 8ZM10.5 9C9.67157 9 9 9.67157 9 10.5V12.5C9 13.3284 9.67157 14 10.5 14C11.3284 14 12 13.3284 12 12.5V10.5C12 9.67157 11.3284 9 10.5 9ZM5.5 1C6.88071 1 8 2.11929 8 3.5V4H15V5H8V5.5C8 6.88071 6.88071 8 5.5 8C4.11929 8 3 6.88071 3 5.5V5H1V4H3V3.5C3 2.11929 4.11929 1 5.5 1ZM5.5 2C4.67157 2 4 2.67157 4 3.5V5.5C4 6.32843 4.67157 7 5.5 7C6.32843 7 7 6.32843 7 5.5V3.5C7 2.67157 6.32843 2 5.5 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M15 12.5L10 7.5L5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

export interface FilterChipProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'style'
  > {
  /** Whether the filter chip is in selected/pressed state. @default false */
  selected?: boolean;
  /** Callback when filter chip selection changes. */
  onSelectedChange?: (selected: boolean) => void;
  /** Optional leading icon/content. Ignored when `isAllFilters` is true. */
  iconLeading?: React.ReactNode;
  /** Optional trailing icon/content. Ignored when `isMultiSelect` is true. */
  iconTrailing?: React.ReactNode;
  /** Whether the filter chip is disabled. @default false */
  disabled?: boolean;
  /**
   * Enable Multi-Select variant with chevron icons.
   * @default false
   */
  isMultiSelect?: boolean;
  /**
   * Controls the open/closed state for Multi-Select variant.
   * @default false
   */
  isOpen?: boolean;
  /**
   * Enable "All Filters" variant with Sliders icon.
   * @default false
   */
  isAllFilters?: boolean;
  /**
   * Show text label in All Filters variant.
   * @default true
   */
  showLabel?: boolean;
  /**
   * Show count in parentheses when `count` is provided.
   * @default false
   */
  showCount?: boolean;
  /** Active filter count to display. */
  count?: number;
  /** Escape hatch for additional CSS classes. */
  UNSAFE_className?: string;
  /** Escape hatch for inline styles. */
  UNSAFE_style?: React.CSSProperties;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  (
    {
      selected = false,
      onSelectedChange,
      iconLeading,
      iconTrailing,
      disabled = false,
      children,
      onClick,
      isAllFilters = false,
      isMultiSelect = false,
      isOpen = false,
      showLabel = true,
      showCount = false,
      count,
      UNSAFE_className,
      UNSAFE_style,
      ...restProps
    },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onSelectedChange?.(!selected);
      }
      onClick?.(e);
    };

    const rootClass = [
      'px-filter-chip',
      selected && 'px-filter-chip--selected',
      isAllFilters && 'px-filter-chip--allFilters',
      isMultiSelect && 'px-filter-chip--multiSelect',
      UNSAFE_className,
    ]
      .filter(Boolean)
      .join(' ');

    const countText =
      showCount && typeof count === 'number' && count > 0 ? ` (${count})` : '';

    // All Filters variant
    if (isAllFilters) {
      const labelText = showLabel ? (children || 'All Filters') : null;
      return (
        <button
          ref={ref}
          type="button"
          className={rootClass}
          style={UNSAFE_style}
          disabled={disabled}
          aria-pressed={selected}
          onClick={handleClick}
          {...restProps}
        >
          <span className="px-filter-chip__icon-leading">
            <SlidersIcon />
          </span>
          {(labelText || countText) && (
            <span className="px-filter-chip__label">
              {labelText}{countText}
            </span>
          )}
        </button>
      );
    }

    // Multi-Select variant
    if (isMultiSelect) {
      const Chevron = isOpen ? ChevronUpIcon : ChevronDownIcon;
      return (
        <button
          ref={ref}
          type="button"
          className={rootClass}
          style={UNSAFE_style}
          disabled={disabled}
          aria-pressed={selected}
          aria-expanded={isOpen}
          onClick={handleClick}
          {...restProps}
        >
          {iconLeading && (
            <span className="px-filter-chip__icon-leading">{iconLeading}</span>
          )}
          <span className="px-filter-chip__label">
            {children}{countText}
          </span>
          <span className="px-filter-chip__icon-trailing">
            <Chevron />
          </span>
        </button>
      );
    }

    // Standard Toggle variant
    return (
      <button
        ref={ref}
        type="button"
        className={rootClass}
        style={UNSAFE_style}
        disabled={disabled}
        aria-pressed={selected}
        onClick={handleClick}
        {...restProps}
      >
        {iconLeading && (
          <span className="px-filter-chip__icon-leading">{iconLeading}</span>
        )}
        <span className="px-filter-chip__label">{children}</span>
        {iconTrailing && (
          <span className="px-filter-chip__icon-trailing">{iconTrailing}</span>
        )}
      </button>
    );
  },
);

FilterChip.displayName = 'FilterChip';
