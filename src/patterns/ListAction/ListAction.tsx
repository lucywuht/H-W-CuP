// @refresh reset

/**
 * @module ListAction
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
 * For prop API + usage notes, read `ListAction.md` in this folder
 * or run `npx ld-kit show ListAction`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/ListAction.tsx
 *
 * AX List Action — `List` + `ListItem` for action queues. Each item supports:
 * - eyebrow / title / text
 * - optional leading custom slot
 * - trailing icon / link / select-checkbox
 * - up to 3 `Attribute` rows
 * - tag (preset or custom), alert slot, footer-action slot
 * - optional bottom divider
 *
 * Adaptations:
 * - CSS module → plain `.css` with `ax-list-action-*` BEM classes.
 * - `core/Checkbox` requires `a11yLabelledBy` (or `label`) + `onChange` event,
 *   not `aria-label` + `onCheckedChange`. The trailing checkbox now uses
 *   `label` (visually-hidden via the source's existing layout — the wrapper
 *   prevents the label text from being shown).
 *   Indeterminate is dropped — `core/Checkbox` exposes `indeterminate` as
 *   a separate prop, but the source's `boolean | 'indeterminate'` callback
 *   shape is downgraded to plain `boolean`.
 * - Trailing icon defaults to `core/Icons.ChevronRightIcon`.
 * - `core/LinkButton` is used for the trailing link.
 * - `core/Divider` is decorative by default (no `decorative` prop).
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Checkbox} from '../../components/Checkbox/Checkbox';
import {Divider} from '../../components/Divider/Divider';
import {ChevronRightIcon} from '../../components/Icons';
import {LinkButton} from '../../components/LinkButton/LinkButton';
import {Tag, type TagColor} from '../../components/Tag/Tag';
import {Attribute} from '../../components/Attribute';

import './ListAction.css';

export type ListActionTagPreset = 'unassigned' | 'assigned' | 'complete';

export interface ListActionTagCustom {
  variant: 'primary' | 'secondary' | 'tertiary';
  color?: TagColor;
  label: string;
}

const TAG_PRESET_MAP: Record<
  ListActionTagPreset,
  {label: string; color: TagColor}
> = {
  unassigned: {label: 'Unassigned', color: 'gray'},
  assigned: {label: 'Assigned', color: 'blue'},
  complete: {label: 'Complete', color: 'green'},
};

export type ListActionLeading = 'empty' | 'custom';
export type ListActionTrailing = 'empty' | 'icon' | 'link' | 'select';

export interface ListActionListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'role'> {
  children: React.ReactNode;
}

export const ListActionList = React.forwardRef<
  HTMLUListElement,
  ListActionListProps
>(({children, className, ...rest}, ref) => (
  <ul
    ref={ref}
    role="list"
    className={cx('ax-list-action', className)}
    {...rest}
  >
    {children}
  </ul>
));
ListActionList.displayName = 'ListActionList';

export interface ListActionItemProps {
  eyebrow?: string;
  title: string;
  text?: string;

  /** @default 'empty' */
  leading?: ListActionLeading;
  leadingContent?: React.ReactNode;

  /** @default 'empty' */
  trailing?: ListActionTrailing;
  /** Falls back to ChevronRightIcon. */
  trailingIcon?: React.ReactNode;
  trailingLink?: {text: string; href?: string; onClick?: () => void};
  trailingChecked?: boolean;
  onTrailingCheckedChange?: (checked: boolean) => void;

  /** Up to 3 Attribute small rows. */
  attributes?: Array<{label: string; icon?: React.ReactNode}>;

  /** Renders a Divider at the bottom of the item. */
  divider?: boolean;

  footerAction?: React.ReactNode;
  alert?: React.ReactNode;

  tag?: ListActionTagPreset | ListActionTagCustom;

  className?: string;
}

function renderLeading(props: ListActionItemProps) {
  const {leading = 'empty', leadingContent} = props;
  if (leading === 'custom') {
    return <div className="ax-list-action__item-leading-custom">{leadingContent}</div>;
  }
  return null;
}

function renderTrailing(props: ListActionItemProps) {
  const {trailing = 'empty', trailingIcon, trailingLink} = props;

  switch (trailing) {
    case 'icon':
      return (
        <div className="ax-list-action__item-trailing-icon">
          <span className="ax-list-action__item-trailing-icon-inner">
            {trailingIcon ?? <ChevronRightIcon size="medium" />}
          </span>
        </div>
      );
    case 'link':
      if (!trailingLink) return null;
      return (
        <div className="ax-list-action__item-trailing-link">
          <LinkButton size="small" onClick={trailingLink.onClick}>
            {trailingLink.text}
          </LinkButton>
        </div>
      );
    case 'select':
      return (
        <div className="ax-list-action__item-trailing-select">
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

export const ListActionItem = React.forwardRef<HTMLLIElement, ListActionItemProps>(
  (props, ref) => {
    const {
      eyebrow,
      title,
      text,
      attributes,
      divider,
      footerAction,
      alert,
      tag,
      className,
    } = props;
    const hasExtras =
      (attributes && attributes.length > 0) || !!alert || !!footerAction;

    return (
      <li ref={ref} role="listitem" className={cx('ax-list-action__item', className)}>
        <div className="ax-list-action__item-row">
          {renderLeading(props)}

          <div className="ax-list-action__item-content-wrapper">
            <div className="ax-list-action__item-content">
              <div className="ax-list-action__item-content-text">
                {eyebrow ? (
                  <p className="ax-list-action__item-eyebrow">{eyebrow}</p>
                ) : null}
                <p className="ax-list-action__item-title">{title}</p>
                {text ? <p className="ax-list-action__item-text">{text}</p> : null}
              </div>
              {tag
                ? (() => {
                    if (typeof tag === 'string') {
                      const {label, color} = TAG_PRESET_MAP[tag];
                      return (
                        <div className="ax-list-action__item-tag">
                          <Tag variant="tertiary" color={color}>
                            {label}
                          </Tag>
                        </div>
                      );
                    }
                    return (
                      <div className="ax-list-action__item-tag">
                        <Tag variant={tag.variant} color={tag.color}>
                          {tag.label}
                        </Tag>
                      </div>
                    );
                  })()
                : null}
            </div>

            {hasExtras ? (
              <div className="ax-list-action__item-extras">
                {attributes && attributes.length > 0 ? (
                  <div className="ax-list-action__item-attributes">
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
                {alert ? (
                  <div className="ax-list-action__item-alert">{alert}</div>
                ) : null}
                {footerAction ? (
                  <div className="ax-list-action__item-footer-action">{footerAction}</div>
                ) : null}
              </div>
            ) : null}
          </div>

          {renderTrailing(props)}
        </div>
        {divider ? (
          <div className="ax-list-action__item-divider">
            <Divider />
          </div>
        ) : null}
      </li>
    );
  },
);
ListActionItem.displayName = 'ListActionItem';

export const ListAction = ListActionList;

ListAction.displayName = 'ListAction';
