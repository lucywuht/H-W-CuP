// @refresh reset

/**
 * @module ListAssociate
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
 * For prop API + usage notes, read `ListAssociate.md` in this folder
 * or run `npx ld-kit show ListAssociate`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/ListAssociate.tsx
 *
 * AX List Associate — `List` + `ListItem` for associate / scheduling lists.
 * Shares the same skeleton as `ListAction` plus a Monitoring section
 * (label + ProgressIndicator + assigned-goal rows) and an associate-specific
 * set of tag presets.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Checkbox} from '../../components/Checkbox/Checkbox';
import {Divider} from '../../components/Divider/Divider';
import {ChevronRightIcon} from '../../components/Icons';
import {LinkButton} from '../../components/LinkButton/LinkButton';
import {Tag, type TagColor} from '../../components/Tag/Tag';
import {Attribute} from '../../components/Attribute';

import './ListAssociate.css';

export type ListAssociateTagPreset =
  | 'absent'
  | 'tardy'
  | 'unavailable'
  | 'removed'
  | 'do-not-disturb'
  | 'meal'
  | 'ppto'
  | 'not-scheduled';

export interface ListAssociateTagCustom {
  variant: 'primary' | 'secondary' | 'tertiary';
  color?: TagColor;
  label: string;
}

const TAG_PRESET_MAP: Record<
  ListAssociateTagPreset,
  {label: string; color: TagColor}
> = {
  absent: {label: 'Absent', color: 'red'},
  tardy: {label: 'Tardy', color: 'spark'},
  unavailable: {label: 'Unavailable', color: 'gray'},
  removed: {label: 'Removed', color: 'gray'},
  'do-not-disturb': {label: 'Do not disturb', color: 'spark'},
  meal: {label: 'Meal', color: 'blue'},
  ppto: {label: 'PPTO', color: 'gray'},
  'not-scheduled': {label: 'Not scheduled', color: 'gray'},
};

export type ListAssociateLeading = 'empty' | 'custom';
export type ListAssociateTrailing = 'empty' | 'icon' | 'link' | 'select';

export interface ListAssociateAssignedGoal {
  title?: string;
  actions?: string;
}

export interface ListAssociateListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'role'> {
  children: React.ReactNode;
}

export const ListAssociateList = React.forwardRef<
  HTMLUListElement,
  ListAssociateListProps
>(({children, className, ...rest}, ref) => (
  <ul
    ref={ref}
    role="list"
    className={cx('ax-list-associate', className)}
    {...rest}
  >
    {children}
  </ul>
));
ListAssociateList.displayName = 'ListAssociateList';

export interface ListAssociateItemProps {
  eyebrow?: string;
  title: string;
  text?: string;

  leading?: ListAssociateLeading;
  leadingContent?: React.ReactNode;

  trailing?: ListAssociateTrailing;
  trailingIcon?: React.ReactNode;
  trailingLink?: {text: string; href?: string; onClick?: () => void};
  trailingChecked?: boolean;
  onTrailingCheckedChange?: (checked: boolean) => void;

  attributes?: Array<{label: string; icon?: React.ReactNode}>;

  divider?: boolean;
  footerAction?: React.ReactNode;

  /** Pass a `core/ProgressIndicator` (or any node). */
  monitoring?: React.ReactNode;
  /** @default 'Progress status' */
  monitoringLabel?: string;
  monitoringGoals?: ListAssociateAssignedGoal[];

  alert?: React.ReactNode;
  tag?: ListAssociateTagPreset | ListAssociateTagCustom;
  className?: string;
}

function AssignedGoal({
  title = 'Goal name',
  actions = '[Action], [Action], [Action]',
}: ListAssociateAssignedGoal) {
  return (
    <div className="ax-list-associate__assigned-goal">
      <p className="ax-list-associate__assigned-goal-title">{title}</p>
      <p className="ax-list-associate__assigned-goal-actions">{actions}</p>
    </div>
  );
}

function renderLeading(props: ListAssociateItemProps) {
  const {leading = 'empty', leadingContent} = props;
  if (leading === 'custom') {
    return (
      <div className="ax-list-associate__item-leading-custom">{leadingContent}</div>
    );
  }
  return null;
}

function renderTrailing(props: ListAssociateItemProps) {
  const {trailing = 'empty', trailingIcon, trailingLink} = props;

  switch (trailing) {
    case 'icon':
      return (
        <div className="ax-list-associate__item-trailing-icon">
          <span className="ax-list-associate__item-trailing-icon-inner">
            {trailingIcon ?? <ChevronRightIcon size="medium" />}
          </span>
        </div>
      );
    case 'link':
      if (!trailingLink) return null;
      return (
        <div className="ax-list-associate__item-trailing-link">
          <LinkButton size="small" onClick={trailingLink.onClick}>
            {trailingLink.text}
          </LinkButton>
        </div>
      );
    case 'select':
      return (
        <div className="ax-list-associate__item-trailing-select">
          <Checkbox
            checked={!!props.trailingChecked}
            label="Select item"
            onChange={(e) => props.onTrailingCheckedChange?.(e.target.checked)}
          />
        </div>
      );
    default:
      return null;
  }
}

export const ListAssociateItem = React.forwardRef<
  HTMLLIElement,
  ListAssociateItemProps
>((props, ref) => {
  const {
    eyebrow,
    title,
    text,
    attributes,
    divider,
    footerAction,
    alert,
    monitoring,
    monitoringLabel = 'Progress status',
    monitoringGoals,
    tag,
    className,
  } = props;

  const hasExtras =
    (attributes && attributes.length > 0) ||
    !!monitoring ||
    !!monitoringGoals?.length ||
    !!alert ||
    !!footerAction;

  return (
    <li ref={ref} role="listitem" className={cx('ax-list-associate__item', className)}>
      <div className="ax-list-associate__item-row">
        {renderLeading(props)}

        <div className="ax-list-associate__item-content-wrapper">
          <div className="ax-list-associate__item-content">
            <div className="ax-list-associate__item-content-text">
              {eyebrow ? (
                <p className="ax-list-associate__item-eyebrow">{eyebrow}</p>
              ) : null}
              <p className="ax-list-associate__item-title">{title}</p>
              {text ? <p className="ax-list-associate__item-text">{text}</p> : null}
            </div>
            {tag
              ? (() => {
                  if (typeof tag === 'string') {
                    const {label, color} = TAG_PRESET_MAP[tag];
                    return (
                      <div className="ax-list-associate__item-tag">
                        <Tag variant="tertiary" color={color}>
                          {label}
                        </Tag>
                      </div>
                    );
                  }
                  return (
                    <div className="ax-list-associate__item-tag">
                      <Tag variant={tag.variant} color={tag.color}>
                        {tag.label}
                      </Tag>
                    </div>
                  );
                })()
              : null}
          </div>

          {hasExtras ? (
            <div className="ax-list-associate__item-extras">
              {attributes && attributes.length > 0 ? (
                <div className="ax-list-associate__item-attributes">
                  {attributes.slice(0, 3).map((attr, i) => (
                    <Attribute
                      key={i}
                      size="small"
                      label={attr.label}
                      icon={attr.icon}
                    />
                  ))}
                </div>
              ) : null}

              {monitoring || (monitoringGoals && monitoringGoals.length > 0) ? (
                <div className="ax-list-associate__item-monitoring">
                  <p className="ax-list-associate__item-monitoring-label">
                    {monitoringLabel}
                  </p>
                  {monitoring}
                  {monitoringGoals && monitoringGoals.length > 0 ? (
                    <div className="ax-list-associate__assigned-goal-list">
                      {monitoringGoals.map((goal, i) => (
                        <AssignedGoal key={i} {...goal} />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {alert ? (
                <div className="ax-list-associate__item-alert">{alert}</div>
              ) : null}
              {footerAction ? (
                <div className="ax-list-associate__item-footer-action">
                  {footerAction}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {renderTrailing(props)}
      </div>

      {divider ? (
        <div className="ax-list-associate__item-divider">
          <Divider />
        </div>
      ) : null}
    </li>
  );
});
ListAssociateItem.displayName = 'ListAssociateItem';

export const ListAssociate = ListAssociateList;

ListAssociate.displayName = 'ListAssociate';
