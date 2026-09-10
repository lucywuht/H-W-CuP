// @refresh reset

/**
 * @module Attribute
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
 * For prop API + usage notes, read `Attribute.md` in this folder
 * or run `npx ld-kit show Attribute`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/Attribute.tsx
 *
 * AX Attribute — leading-icon + label pattern with size (small / large) and
 * 5 color variants. Optionally appends a `→ secondary label` to the right.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Icon} from '../Icons';

import './Attribute.css';

export type AttributeSize = 'small' | 'large';
export type AttributeColor =
  | 'default'
  | 'brand'
  | 'negative'
  | 'inverse'
  | 'highlight';

export interface AttributeProps {
  /** Display label. */
  label: string;
  /** @default 'small' */
  size?: AttributeSize;
  /** @default 'default' */
  color?: AttributeColor;
  /** Leading icon. Defaults to the LD `Tag` icon. */
  icon?: React.ReactNode;
  /** When true, appends `→ label2` after the label. @default false */
  additionalLabel?: boolean;
  /** Secondary label rendered when `additionalLabel` is true. */
  label2?: string;
  className?: string;
}

const ICON_SIZE: Record<AttributeSize, number> = {small: 16, large: 20};

function ArrowRightIcon({size = 16}: {size?: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="ax-attribute__additional-icon"
    >
      <path
        d="M9 3.5 13.5 8 9 12.5M13 8H2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Attribute({
  label,
  size = 'small',
  color = 'default',
  icon,
  additionalLabel = false,
  label2 = 'Label 2',
  className,
}: AttributeProps) {
  const iconSize = ICON_SIZE[size];
  const resolvedIcon = icon ?? (
    <Icon name="Tag" decorative style={{fontSize: iconSize}} />
  );

  return (
    <span
      className={cx(
        'ax-attribute',
        `ax-attribute--${size}`,
        `ax-attribute--color-${color}`,
        className,
      )}
    >
      <span className="ax-attribute__icon">{resolvedIcon}</span>
      {additionalLabel ? (
        <span className="ax-attribute__additional-container">
          <span className={cx('ax-attribute__label', `ax-attribute__label--${size}`)}>
            {label}
          </span>
          <ArrowRightIcon />
          <span className={cx('ax-attribute__label', `ax-attribute__label--${size}`)}>
            {label2}
          </span>
        </span>
      ) : (
        <span className={cx('ax-attribute__label', `ax-attribute__label--${size}`)}>
          {label}
        </span>
      )}
    </span>
  );
}


Attribute.displayName = 'Attribute';
