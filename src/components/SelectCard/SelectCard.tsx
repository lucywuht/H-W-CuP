'use client';
// @refresh reset

/**
 * @module SelectCard
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
 * For prop API + usage notes, read `SelectCard.md` in this folder
 * or run `npx ld-kit show SelectCard`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, invariant, applyCommonProps} from '../../common/helpers';
import {emit} from '../../common/helpers';
import {Checkbox} from '../Checkbox/Checkbox';
import {Radio} from '../Radio/Radio';
import './SelectCard.css';

// ---------------------------------------------------------------------------
// SelectCard - Single Select Mode (Radio)
// ---------------------------------------------------------------------------

export interface SelectCardSingleSelectProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'onChange' | 'style'
    > {
  /**
   * Enable single-select mode using Radio button control.
   * When true, only one card in the group can be selected.
   *
   * @default false
   */
  singleSelect: true;

  /**
   * The callback fired when the radio selection changes.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * If the card is checked (selected).
   *
   * @default false
   */
  checked?: boolean;

  /**
   * The radio group name - required for single select to work properly.
   */
  name: string;

  /**
   * The value for the radio.
   */
  value?: number | string;

  /**
   * Disable multi-select specific props for single-select mode.
   */
  indeterminate?: never;
}

// ---------------------------------------------------------------------------
// SelectCard - Multi Select Mode (Checkbox)
// ---------------------------------------------------------------------------

export interface SelectCardMultiSelectProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'onChange' | 'style'
    > {
  /**
   * Enable multi-select mode using Checkbox control.
   * When false (or omitted), multiple cards can be selected independently.
   *
   * @default false
   */
  singleSelect?: false;

  /**
   * The callback fired when the checkbox selection changes.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * If the checkbox is checked (selected).
   *
   * @default false
   */
  checked?: boolean;

  /**
   * If the checkbox is indeterminate (shows dash icon).
   * Only applies in multi-select mode.
   *
   * @default false
   */
  indeterminate?: boolean;

  /**
   * The name for the checkbox.
   */
  name?: string;

  /**
   * The value for the checkbox.
   */
  value?: number | string;
}

// ---------------------------------------------------------------------------
// Common SelectCard Props
// ---------------------------------------------------------------------------

export interface SelectCardCommonProps {
  /**
   * The label/title for the card.
   * Required for accessibility unless a11yLabelledBy is provided.
   */
  label?: React.ReactNode;

  /**
   * The accessible label reference IDs for the selection control.
   * Required if omitting `label`.
   */
  a11yLabelledBy?: string;

  /**
   * The content for the card body.
   */
  children?: React.ReactNode;

  /**
   * If the card selection is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * The id for the selection input.
   */
  id?: string;

  /**
   * The size for the card.
   * `'small'` is 20×20 px control, `'medium'` (default) is 24×24 px.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium';

  /**
   * Apply custom styles (not recommended for primary styling).
   */
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;

  /**
   * The props spread to the selection control (Checkbox or Radio input).
   *
   * @default {}
   */
  selectProps?: React.ComponentPropsWithoutRef<'input'>;
}

export type SelectCardProps = (
  | SelectCardSingleSelectProps
  | SelectCardMultiSelectProps
) &
  SelectCardCommonProps;

/**
 * SelectCard combines a Card with a Checkbox (multi-select) or Radio (single-select) control.
 * Use this component to allow users to select one or more cards from a list.
 */
export const SelectCard = React.forwardRef<HTMLInputElement, SelectCardProps>(
  (props, ref) => {
    const {
      a11yLabelledBy,
      checked = false,
      children,
      disabled = false,
      id: initialId,
      indeterminate = false,
      label,
      name,
      onChange,
      selectProps = {},
      singleSelect = false,
      size = 'medium',
      value,
      UNSAFE_className,
      UNSAFE_style,
      ...rest
    } = applyCommonProps(props);

    const hasLabel = (label ? 1 : 0) + (a11yLabelledBy ? 1 : 0) === 1;

    invariant(
      hasLabel,
      '`SelectCard` accessibility violation. `SelectCard` requires a `label` OR an `a11yLabelledBy`.'
    );

    const id = useStableId(initialId);
    const {className: selectClassName, ...selectRest} = selectProps;

    const cardClasses = cx(
      'ld-select-card-container',
      singleSelect && 'ld-select-card-single-select',
      !singleSelect && 'ld-select-card-multi-select',
      checked && 'ld-select-card-checked',
      disabled && 'ld-select-card-disabled',
      size === 'small' && 'ld-select-card-small',
      UNSAFE_className
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const eventType = singleSelect ? 'ui:select-card:radio:change' : 'ui:select-card:checkbox:change';
      emit(eventType, {name, value, checked: e.target.checked});
      onChange(e);
    };

    const commonProps = {
      checked,
      disabled,
      id,
      onChange: handleChange,
      ref,
      size: size as 'small' | 'medium',
      value,
    };

    const radioCheckboxProps = singleSelect 
      ? { radioProps: {className: selectClassName, ...selectRest} }
      : { checkboxProps: {className: selectClassName, ...selectRest} };

    return (
      <div
        className={cardClasses}
        style={UNSAFE_style}
        {...rest}
      >
        <div className={'ld-select-card-content-wrapper'}>
          <div className={'ld-select-card-control'}>
            {singleSelect ? (
              a11yLabelledBy ? (
                <Radio
                  name={name as string}
                  a11yLabelledBy={a11yLabelledBy}
                  {...commonProps}
                  {...radioCheckboxProps}
                />
              ) : (
                <Radio
                  name={name as string}
                  label={label}
                  {...commonProps}
                  {...radioCheckboxProps}
                />
              )
            ) : (
              a11yLabelledBy ? (
                <Checkbox
                  name={name}
                  a11yLabelledBy={a11yLabelledBy}
                  indeterminate={indeterminate}
                  {...commonProps}
                  {...radioCheckboxProps}
                />
              ) : (
                <Checkbox
                  name={name}
                  label={label}
                  indeterminate={indeterminate}
                  {...commonProps}
                  {...radioCheckboxProps}
                />
              )
            )}
          </div>

          {children && (
            <div className={'ld-select-card-children'}>
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SelectCard.displayName = 'SelectCard';
