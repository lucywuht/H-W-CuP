// @refresh reset

/**
 * @module ListGoal
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
 * For prop API + usage notes, read `ListGoal.md` in this folder
 * or run `npx ld-kit show ListGoal`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/ListGoal.tsx
 *
 * AX List Goal — list item representing a goal with optional progress
 * indicator, content slot, AI insight, and alert.
 *
 * Adaptations:
 * - `<img>` illustration → `PlaceholderMedia` (no external image deps).
 * - `SidekickLogoIcon` is private to `agents/SidekickAgent`; the same magic
 *   gradient is inlined here.
 * - `core/Alert` accepts `actionButtonProps`, not an `action` JSX node, so
 *   the alert action is threaded through that.
 * - `core/IconButton` has `variant="round" | "full"`; the source's
 *   `variant="ghost"` is mapped to `round`.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId} from '../../common/helpers';
import {PlaceholderMedia} from '../../common/PlaceholderMedia';
import {Alert} from '../../components/Alert/Alert';
import {Divider} from '../../components/Divider/Divider';
import {IconButton} from '../../components/IconButton/IconButton';
import {ChevronRightIcon} from '../../components/Icons';
import {ProgressIndicator} from '../../components/ProgressIndicator/ProgressIndicator';
import {Tag, type TagColor} from '../../components/Tag/Tag';
import {IntelligentInsight} from '../IntelligentInsight';

import './ListGoal.css';

export interface ListGoalProps {
  /** @default 'default' */
  type?: 'default' | 'ai';
  goalName: string;
  /** Renders a `PlaceholderMedia` with this label inside it. */
  illustrationSrc?: string;
  illustrationAlt?: string;

  /** @default true */
  showTag?: boolean;
  /** @default 'Tag label' */
  tagLabel?: string;
  /** @default 'tertiary' */
  tagVariant?: 'primary' | 'secondary' | 'tertiary';
  /** @default 'warning' */
  tagColor?: TagColor;

  progressTitle?: string;
  /** @default true */
  showProgressBar?: boolean;
  /** @default 50 */
  progressValue?: number;
  /** @default 'Label' */
  progressLabel?: string;
  /** @default 'Value label' */
  progressValueLabel?: string;

  children?: React.ReactNode;

  /** @default true */
  showInsight?: boolean;
  insightLabel?: string;

  /** @default true */
  showAlert?: boolean;
  alertMessage?: string;
  alertAction?: string;
  onAlertAction?: () => void;

  /** @default true */
  showNavigation?: boolean;
  onNavigate?: () => void;

  /** @default true */
  showDivider?: boolean;

  className?: string;
  style?: React.CSSProperties;
}

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

export const ListGoal = React.forwardRef<HTMLElement, ListGoalProps>(
  (
    {
      type = 'default',
      goalName,
      illustrationSrc,
      illustrationAlt = '',
      showTag = true,
      tagLabel = 'Tag label',
      tagVariant = 'tertiary',
      tagColor = 'warning',
      progressTitle,
      showProgressBar = true,
      progressValue = 50,
      progressLabel = 'Label',
      progressValueLabel = 'Value label',
      children,
      showInsight = true,
      insightLabel = 'Data-based intelligence to support action.',
      showAlert = true,
      alertMessage = 'Alert message',
      alertAction = 'Action button',
      onAlertAction,
      showNavigation = true,
      onNavigate,
      showDivider = true,
      className,
      style,
    },
    ref,
  ) => {
    const isAI = type === 'ai';

    return (
      <article
        ref={ref}
        className={cx('ax-list-goal', className)}
        style={style}
      >
        <div className="ax-list-goal__top-row">
          {illustrationSrc ? (
            <PlaceholderMedia
              shape="rect"
              width={64}
              height={64}
              className="ax-list-goal__illustration"
              label={illustrationAlt || illustrationSrc}
            />
          ) : (
            <div className="ax-list-goal__illustration-placeholder" aria-hidden />
          )}

          <div className="ax-list-goal__content-container">
            <div className="ax-list-goal__name-row">
              {isAI ? (
                <div className="ax-list-goal__ai-name-wrapper">
                  <div className="ax-list-goal__logo-container">
                    <SidekickLogoIcon size={16} />
                  </div>
                  <span className="ax-list-goal__goal-name ax-list-goal__goal-name--brand">
                    {goalName}
                  </span>
                </div>
              ) : (
                <span className="ax-list-goal__goal-name">{goalName}</span>
              )}

              {showTag ? (
                <Tag variant={tagVariant} color={tagColor}>
                  {tagLabel}
                </Tag>
              ) : null}
            </div>

            {progressTitle || showProgressBar ? (
              <div className="ax-list-goal__progress-section">
                {progressTitle ? (
                  <p className="ax-list-goal__progress-title">{progressTitle}</p>
                ) : null}
                {showProgressBar ? (
                  <ProgressIndicator
                    variant="info"
                    value={progressValue}
                    label={progressLabel}
                    valueLabel={progressValueLabel}
                  />
                ) : null}
              </div>
            ) : null}

            {children ? (
              <div className="ax-list-goal__content-slot">{children}</div>
            ) : null}

            {showInsight && insightLabel ? (
              <div className="ax-list-goal__insight-wrapper">
                <IntelligentInsight label={insightLabel} />
              </div>
            ) : null}

            {showAlert && alertMessage ? (
              <div className="ax-list-goal__alert-wrapper">
                <Alert
                  variant="warning"
                  actionButtonProps={
                    alertAction
                      ? {children: alertAction, onClick: onAlertAction}
                      : undefined
                  }
                >
                  {alertMessage}
                </Alert>
              </div>
            ) : null}
          </div>

          <div
            className={cx(
              'ax-list-goal__chevron-container',
              !showNavigation && 'ax-list-goal__chevron-container--hidden',
            )}
          >
            <IconButton
              variant="round"
              size="medium"
              a11yLabel="Navigate to goal"
              onClick={onNavigate}
              tabIndex={showNavigation ? undefined : -1}
            >
              <ChevronRightIcon size="medium" />
            </IconButton>
          </div>
        </div>

        {showDivider ? <Divider /> : null}
      </article>
    );
  },
);

ListGoal.displayName = 'ListGoal';

