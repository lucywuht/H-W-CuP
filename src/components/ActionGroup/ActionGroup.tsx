// @refresh reset

/**
 * @module ActionGroup
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
 * For prop API + usage notes, read `ActionGroup.md` in this folder
 * or run `npx ld-kit show ActionGroup`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Button} from '../Button';
import {emit} from '../../common/helpers';
import './ActionGroup.css';


export type ActionGroupLayout = 'inline' | 'stacked';
export type ActionGroupPattern =
  | 'primary-secondary'
  | 'primary-tertiary'
  | 'secondary-tertiary'
  | 'tertiary-tertiary'
  | 'three-options';

export interface ActionGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /** @default 'inline' */
  layout?: ActionGroupLayout;
  /** @default 'primary-secondary' */
  pattern?: ActionGroupPattern;
  preferredLabel?: string;
  alternateLabel?: string;
  thirdLabel?: string;
  /** @default true */
  preferredRight?: boolean;
  /** @default true */
  fullWidth?: boolean;
  onPreferred?: React.MouseEventHandler<HTMLButtonElement>;
  onAlternate?: React.MouseEventHandler<HTMLButtonElement>;
  onThird?: React.MouseEventHandler<HTMLButtonElement>;
  preferredButtonProps?: Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick' | 'children'>;
  alternateButtonProps?: Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick' | 'children'>;
  thirdButtonProps?: Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick' | 'children'>;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

function PreferredPrimary({label, fullWidth, onClick, buttonProps}: {label: string; fullWidth?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; buttonProps?: object}) {
  return <Button variant="primary" size="medium" isFullWidth={fullWidth} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { emit('ui:action-group:click', {role: 'preferred', variant: 'primary', label}); onClick?.(e); }} {...buttonProps}>{label}</Button>;
}

function PreferredSecondary({label, fullWidth, onClick, buttonProps}: {label: string; fullWidth?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; buttonProps?: object}) {
  return <Button variant="secondary" size="medium" isFullWidth={fullWidth} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { emit('ui:action-group:click', {role: 'preferred', variant: 'secondary', label}); onClick?.(e); }} {...buttonProps}>{label}</Button>;
}

function AlternateSecondary({label, fullWidth, onClick, buttonProps}: {label: string; fullWidth?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; buttonProps?: object}) {
  return <Button variant="secondary" size="medium" isFullWidth={fullWidth} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { emit('ui:action-group:click', {role: 'alternate', variant: 'secondary', label}); onClick?.(e); }} {...buttonProps}>{label}</Button>;
}

function TertiaryButton({label, fullWidth, onClick, buttonProps}: {label: string; fullWidth?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; buttonProps?: object}) {
  return <Button variant="tertiary" size="medium" isFullWidth={fullWidth} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { emit('ui:action-group:click', {role: 'tertiary', variant: 'tertiary', label}); onClick?.(e); }} {...buttonProps}>{label}</Button>;
}

export const ActionGroup = React.forwardRef<HTMLDivElement, ActionGroupProps>((props, ref) => {
  const {
    layout = 'inline', pattern = 'primary-secondary',
    preferredLabel = 'Preferred', alternateLabel = 'Alternate', thirdLabel = 'Alternate',
    preferredRight = true, fullWidth = true,
    onPreferred, onAlternate, onThird,
    preferredButtonProps, alternateButtonProps, thirdButtonProps,
    className, ...rest
  } = applyCommonProps(props);

  const isStacked = layout === 'stacked';

  if (isStacked && pattern === 'three-options') {
    return (
      <div ref={ref} className={cx('ld-wcp-actiongroup-group', 'ld-wcp-actiongroup-stacked', className)} {...rest}>
        <div className="ld-wcp-actiongroup-inlineRow">
          <AlternateSecondary label={alternateLabel} fullWidth onClick={onAlternate} buttonProps={alternateButtonProps} />
          <PreferredPrimary label={preferredLabel} fullWidth onClick={onPreferred} buttonProps={preferredButtonProps} />
        </div>
        <TertiaryButton label={thirdLabel} fullWidth onClick={onThird} buttonProps={thirdButtonProps} />
      </div>
    );
  }

  if (isStacked) {
    const preferred = (pattern === 'primary-secondary' || pattern === 'primary-tertiary')
      ? <PreferredPrimary label={preferredLabel} fullWidth onClick={onPreferred} buttonProps={preferredButtonProps} />
      : <PreferredSecondary label={preferredLabel} fullWidth onClick={onPreferred} buttonProps={preferredButtonProps} />;
    const alternate = pattern === 'primary-secondary'
      ? <AlternateSecondary label={alternateLabel} fullWidth onClick={onAlternate} buttonProps={alternateButtonProps} />
      : <TertiaryButton label={alternateLabel} fullWidth onClick={onAlternate} buttonProps={alternateButtonProps} />;
    return (
      <div ref={ref} className={cx('ld-wcp-actiongroup-group', 'ld-wcp-actiongroup-stacked', className)} {...rest}>
        {preferred}{alternate}
      </div>
    );
  }

  // Inline
  function renderInline() {
    switch (pattern) {
      case 'primary-secondary': {
        const alt = <AlternateSecondary label={alternateLabel} fullWidth={fullWidth} onClick={onAlternate} buttonProps={alternateButtonProps} />;
        const pref = <PreferredPrimary label={preferredLabel} fullWidth={fullWidth} onClick={onPreferred} buttonProps={preferredButtonProps} />;
        return preferredRight ? <>{alt}{pref}</> : <>{pref}{alt}</>;
      }
      case 'primary-tertiary': {
        const alt = <TertiaryButton label={alternateLabel} fullWidth={fullWidth} onClick={onAlternate} buttonProps={alternateButtonProps} />;
        const prim = <PreferredPrimary label={preferredLabel} fullWidth={fullWidth} onClick={onPreferred} buttonProps={preferredButtonProps} />;
        return preferredRight ? <>{alt}{prim}</> : <>{prim}{alt}</>;
      }
      case 'secondary-tertiary': {
        const alt = <TertiaryButton label={alternateLabel} fullWidth={fullWidth} onClick={onAlternate} buttonProps={alternateButtonProps} />;
        const sec = <PreferredSecondary label={preferredLabel} fullWidth={fullWidth} onClick={onPreferred} buttonProps={preferredButtonProps} />;
        return preferredRight ? <>{alt}{sec}</> : <>{sec}{alt}</>;
      }
      case 'tertiary-tertiary': {
        return (
          <>
            <TertiaryButton label={alternateLabel} fullWidth={fullWidth} onClick={onAlternate} buttonProps={alternateButtonProps} />
            <TertiaryButton label={preferredLabel} fullWidth={fullWidth} onClick={onPreferred} buttonProps={preferredButtonProps} />
          </>
        );
      }
      default: return null;
    }
  }

  return (
    <div ref={ref} className={cx('ld-wcp-actiongroup-group', 'ld-wcp-actiongroup-inline', fullWidth && 'ld-wcp-actiongroup-inlineFullWidth', className)} {...rest}>
      {renderInline()}
    </div>
  );
});

ActionGroup.displayName = 'ActionGroup';
