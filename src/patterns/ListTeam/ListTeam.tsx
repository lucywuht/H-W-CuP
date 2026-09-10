// @refresh reset

/**
 * @module ListTeam
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
 * For prop API + usage notes, read `ListTeam.md` in this folder
 * or run `npx ld-kit show ListTeam`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/ListTeam.tsx
 *
 * AX List Team — associate team row for navigational and selectable team lists.
 * Adapted to local icon, attribute, tag, and placeholder-media primitives.
 */
import * as React from 'react';

import {Attribute} from '../../components/Attribute';
import {cx} from '../../common/cx';
import {PlaceholderMedia} from '../../common/PlaceholderMedia';
import {IconButton} from '../../components/IconButton/IconButton';
import {ChevronRightIcon, Icon} from '../../components/Icons';
import {Tag} from '../../components/Tag/Tag';

import './ListTeam.css';

export type ListTeamVariant = 'navigational' | 'selectable';
export type ListTeamState = 'default' | 'pressed' | 'selected';

export interface ListTeamProps {
  /** @default 'navigational' */
  variant?: ListTeamVariant;
  /** Selected is intended for selectable rows. @default 'default' */
  state?: ListTeamState;
  title: string;
  subtitle?: string;
  illustrationLabel?: string;
  illustrationElement?: React.ReactNode;
  attribute1?: string;
  attribute2?: string;
  tagLabel?: string;
  /** @default false */
  starred?: boolean;
  starAriaLabel?: string;
  onStarPress?: () => void;
  onPress?: () => void;
  className?: string;
}

export function ListTeam({
  variant = 'navigational',
  state = 'default',
  title,
  subtitle,
  illustrationLabel,
  illustrationElement,
  attribute1,
  attribute2,
  tagLabel,
  starred = false,
  starAriaLabel = 'Save team',
  onStarPress,
  onPress,
  className,
}: ListTeamProps) {
  const isInteractive = !!onPress;
  const isSelected = variant === 'selectable' && state === 'selected';

  return (
    <div
      className={cx(
        'ax-list-team',
        `ax-list-team--${variant}`,
        state === 'pressed' && 'ax-list-team--pressed',
        isSelected && 'ax-list-team--selected',
        className,
      )}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={variant === 'selectable' ? isSelected : undefined}
      onClick={onPress}
      onKeyDown={
        isInteractive
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onPress();
              }
            }
          : undefined
      }
    >
      <div className="ax-list-team__illustration">
        {illustrationElement ?? (
          <PlaceholderMedia
            shape="circle"
            width={40}
            height={40}
            label={illustrationLabel ?? title}
          />
        )}
      </div>

      <div className="ax-list-team__content">
        <div className="ax-list-team__text-group">
          <span className="ax-list-team__title">{title}</span>
          {subtitle ? <span className="ax-list-team__subtitle">{subtitle}</span> : null}
        </div>

        {attribute1 ? (
          <Attribute
            size="small"
            label={attribute1}
            icon={<Icon name="Clock" decorative style={{fontSize: 16}} />}
          />
        ) : null}

        {attribute2 ? (
          <Attribute
            size="small"
            label={attribute2}
            icon={<Icon name="Clock" decorative style={{fontSize: 16}} />}
          />
        ) : null}
      </div>

      <div className="ax-list-team__trailing">
        {tagLabel ? (
          <Tag variant="tertiary" color="blue">
            {tagLabel}
          </Tag>
        ) : null}

        <IconButton
          a11yLabel={starAriaLabel}
          variant="round"
          size="medium"
          onClick={(event) => {
            event.stopPropagation();
            onStarPress?.();
          }}
        >
          <Icon name={starred ? 'StarFill' : 'Star'} decorative style={{fontSize: 20}} />
        </IconButton>

        {variant === 'navigational' ? (
          <span className="ax-list-team__chevron" aria-hidden>
            <ChevronRightIcon size="medium" />
          </span>
        ) : null}
      </div>
    </div>
  );
}

ListTeam.displayName = 'ListTeam';
