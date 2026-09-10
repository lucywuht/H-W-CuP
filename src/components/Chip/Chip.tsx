'use client';
// @refresh reset

/**
 * @module Chip
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
 * For prop API + usage notes, read `Chip.md` in this folder
 * or run `npx ld-kit show Chip`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {emit} from '../../common/helpers';
import './Chip.css';
// ---------------------------------------------------------------------------
// ChipGroup (inlined sub-component)
// ---------------------------------------------------------------------------

export interface ChipGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The content for the chip group.
   */
  children: React.ReactNode;
}

/**
 * Chip Groups display multiple related chips in a horizontal row to help with arrangement and spacing.
 * *
 */
export const ChipGroup: React.FunctionComponent<ChipGroupProps> = (props) => {
  const {children, className, ...rest} = applyCommonProps(props);

  return (
    <div
      className={cx('ld-chip-chipgroup-chipGroup', className)}
      role="list"
      {...rest}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        return (
          <div key={index} role="listitem">
            {child}
          </div>
        );
      })}
    </div>
  );
};

ChipGroup.displayName = 'ChipGroup';

export type ChipSize = 'large' | 'small';

export interface ChipProps
  extends Omit<React.ComponentPropsWithRef<'button'>, 'className' | 'style'> {
  /**
   * The content for the chip.
   */
  children: React.ReactNode;
  /**
   * If the chip is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The leading content for the chip.
   */
  leading?: React.ReactNode;
  /**
   * The callback fired when the chip is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * If the chip is selected.
   *
   * @default false
   */
  selected?: boolean;
  /**
   * The size for the chip.
   *
   * @default "small"
   */
  size?: ChipSize;
  /**
   * The trailing content for the chip.
   */
  trailing?: React.ReactNode;
}

/**
 * Chips allow users to make selections, filter content, or trigger actions.
 * *
 */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (props, ref) => {
    const {
      children,
      className,
      leading,
      trailing,
      selected = false,
      size = 'small',
      onClick,
      ...rest
    } = applyCommonProps(props);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      emit('ui:chip:click', {selected: !selected, children: typeof children === 'string' ? children : undefined});
      onClick?.(e);
    };

    return (
      <button
        aria-pressed={selected}
        className={cx('ld-chip-chip', size === 'large' && 'ld-chip-large', size === 'small' && 'ld-chip-small', selected && 'ld-chip-selected', className)}
        ref={ref}
        type="button"
        onClick={handleClick}
        {...rest}
      >
        {leading && <span className={'ld-chip-leading'}>{leading}</span>}
        {children}
        {trailing && <span className={'ld-chip-trailing'}>{trailing}</span>}
      </button>
    );
  }
);

Chip.displayName = 'Chip';
