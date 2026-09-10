// @refresh reset

/**
 * @module IntelligentInsight
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
 * For prop API + usage notes, read `IntelligentInsight.md` in this folder
 * or run `npx ld-kit show IntelligentInsight`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/IntelligentInsight.tsx
 *
 * AX Intelligent Insight — card-shaped surface that pairs the Sidekick AI
 * brand mark with a short insight label and an optional full-width action
 * button.
 *
 * Changes from the source:
 * - CSS module → plain `.css` with `ax-intelligent-insight-*` BEM classes.
 * - The source imports `SidekickLogoIcon` from `icons-custom/`. That icon
 *   isn't exported from ld-kit (it's private to `agents/SidekickAgent`),
 *   so the same magic-gradient SVG is inlined here.
 * - Uses `core/Button` (variant=secondary, `isFullWidth`).
 * - `UNSAFE_*` dropped in favour of plain `className` / `style`.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId} from '../../common/helpers';
import {Button} from '../../components/Button/Button';
import {Icon} from '../../components/Icons';

import './IntelligentInsight.css';

export interface IntelligentInsightProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Eyebrow/insight text shown next to the Sidekick logo. */
  label: string;
  /** Optional recommendation title. When present, the card uses the expanded recommendation layout. */
  title?: string;
  /** Optional body copy shown under the title. */
  description?: string;
  /** Attribute rows shown under the description. */
  attributes?: IntelligentInsightAttribute[];
  /** Show the full-width action button below the label. @default false */
  showButton?: boolean;
  /** Label for the action button. @default 'Button label' */
  buttonLabel?: string;
  /** Fires when the action button is clicked. */
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export type IntelligentInsightAttributeIcon =
  | 'target'
  | 'users'
  | 'calendar'
  | 'clock'
  | 'associate';

export interface IntelligentInsightAttribute {
  /** Kit icon name shortcut or a custom React node. */
  icon?: IntelligentInsightAttributeIcon | React.ReactNode;
  /** Attribute text. Use rich text to bold the leading value when needed. */
  label: React.ReactNode;
}

const ATTRIBUTE_ICON_NAMES: Record<IntelligentInsightAttributeIcon, string> = {
  target: 'Targeting',
  users: 'Users',
  calendar: 'Calendar',
  clock: 'Clock',
  associate: 'Associate',
};

function SidekickLogoIcon({size = 16}: {size?: number}) {
  const gradientId = useStableId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          x2="24"
          y1="0"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--ld-semantic-color-text-magic-start, #0053E2)" />
          <stop offset="50%" stopColor="var(--ld-semantic-color-text-magic-middle, #3D90EC)" />
          <stop offset="100%" stopColor="var(--ld-semantic-color-text-magic-stop, #79CDF6)" />
        </linearGradient>
      </defs>
      <path
        d="M7.41376 22.9792C6.05479 21.6202 6.05479 19.4169 7.41376 18.0579L17.2564 8.21533L18.7327 9.69172C20.6353 11.5943 20.6353 14.679 18.7327 16.5815L12.3351 22.9792C10.9761 24.3382 8.77274 24.3382 7.41376 22.9792Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M5.26677 14.3067C3.3642 12.4042 3.3642 9.31949 5.26677 7.41692L11.6645 1.01923C13.0234 -0.339745 15.2268 -0.339744 16.5857 1.01923C17.9447 2.37821 17.9447 4.58155 16.5857 5.94053L6.74316 15.7831L5.26677 14.3067Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

function AttributeIcon({icon}: {icon?: IntelligentInsightAttribute['icon']}) {
  if (!icon) return <Icon name="InfoCircle" size="small" />;
  if (typeof icon === 'string') {
    return <Icon name={ATTRIBUTE_ICON_NAMES[icon as IntelligentInsightAttributeIcon]} size="medium" />;
  }
  return <>{icon}</>;
}

export const IntelligentInsight = React.forwardRef<
  HTMLDivElement,
  IntelligentInsightProps
>(
  (
    {
      label,
      title,
      description,
      attributes,
      showButton = false,
      buttonLabel = 'Button label',
      onButtonClick,
      className,
      ...rest
    },
    ref,
  ) => {
    const expanded = Boolean(title || description || attributes?.length);

    return (
      <div
        ref={ref}
        className={cx(
          'ax-intelligent-insight',
          expanded && 'ax-intelligent-insight--expanded',
          className,
        )}
        {...rest}
      >
        <div className="ax-intelligent-insight__icon-text-row">
          <div className="ax-intelligent-insight__icon-wrapper">
            <SidekickLogoIcon size={expanded ? 24 : 16} />
          </div>
          <p className="ax-intelligent-insight__label">{label}</p>
        </div>

        {title ? <h3 className="ax-intelligent-insight__title">{title}</h3> : null}
        {description ? (
          <p className="ax-intelligent-insight__description">{description}</p>
        ) : null}

        {attributes?.length ? (
          <div className="ax-intelligent-insight__attributes">
            {attributes.slice(0, 4).map((attribute, index) => (
              <div key={index} className="ax-intelligent-insight__attribute-row">
                <span className="ax-intelligent-insight__attribute-icon">
                  <AttributeIcon icon={attribute.icon} />
                </span>
                <span className="ax-intelligent-insight__attribute-label">
                  {attribute.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {showButton ? (
          <div className="ax-intelligent-insight__button-container">
            <Button
              variant={expanded ? 'primary' : 'secondary'}
              size={expanded ? 'large' : 'small'}
              isFullWidth
              onClick={onButtonClick}
            >
              {buttonLabel}
            </Button>
          </div>
        ) : null}
      </div>
    );
  },
);

IntelligentInsight.displayName = 'IntelligentInsight';

