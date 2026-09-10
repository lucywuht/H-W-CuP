// @refresh reset

/**
 * @module SearchBar
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
 * For prop API + usage notes, read `SearchBar.md` in this folder
 * or run `npx ld-kit show SearchBar`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {CloseIcon} from '../Icons';
import {emit} from '../../common/helpers';
import './SearchBar.css';

export interface SearchBarProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const SearchBar: React.FunctionComponent<SearchBarProps> = (props) => {
  const {value, onChange, onClear, onCancel, placeholder = 'Enter search term(s)', disabled = false, className, ...rest} = applyCommonProps(props);
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isActivated = isFocused;
  const hasValue = value.length > 0;

  const handleClear = () => {
    emit('ui:search:clear', {previousValue: value});
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    emit('ui:search:cancel', {previousValue: value});
    onChange('');
    onCancel?.();
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handlePillClick = () => {
    if (!disabled) inputRef.current?.focus();
  };

  return (
    <div className={cx('ld-wcp-searchbar-wrapper', className)} role="search" {...rest}>
      <div
        className={cx(
          'ld-wcp-searchbar-pill',
          isActivated && 'ld-wcp-searchbar-pillActivated',
          disabled && 'ld-wcp-searchbar-pillDisabled'
        )}
        onClick={handlePillClick}
      >
        <div className="ld-wcp-searchbar-iconWrapper" aria-hidden="true">
          <i className="ld ld-Search ld-wcp-searchbar-searchIcon" aria-hidden="true" style={{fontSize: '24px'}} />
        </div>
        <div className="ld-wcp-searchbar-inputArea">
          <input
            ref={inputRef}
            type="search"
            className="ld-wcp-searchbar-input"
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isActivated ? placeholder : ''}
            disabled={disabled}
            aria-label={placeholder}
            autoComplete="off"
          />
          {!isActivated && !hasValue && (
            <span className="ld-wcp-searchbar-placeholder" aria-hidden="true">{placeholder}</span>
          )}
        </div>
        {isActivated && hasValue && (
          <button
            type="button"
            className="ld-wcp-searchbar-clearBtn"
            onClick={e => { e.stopPropagation(); handleClear(); }}
            aria-label="Clear search"
            tabIndex={0}
          >
            <CloseIcon size="medium" />
          </button>
        )}
      </div>
      {isActivated && !disabled && (
        <button
          type="button"
          className="ld-wcp-searchbar-cancelBtn"
          onMouseDown={e => { e.preventDefault(); handleCancel(); }}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

SearchBar.displayName = 'SearchBar';
