import * as React from 'react';

import { Divider } from '../../components/Divider';
import { Icon } from '../../components/Icons';

type SvgProps = React.SVGProps<SVGSVGElement>;

type SideNavItem = {
  id: string;
  label: string;
  Icon: React.ComponentType<SvgProps>;
  trailingIcon?: 'chevronDown' | 'linkExternal';
};

type SideNavProps = {
  variant: 'expanded' | 'collapsed';
  activeNavItem: string;
  onNavChange: (navId: string) => void;
  topNavItems: SideNavItem[];
  adminNavItem: SideNavItem;
  researcherNavItem?: SideNavItem;
  persona?: 'admin' | 'researcher' | 'user';
  onToggleVariant: () => void;
};

function NavRow({
  item,
  active,
  showLabel,
  onClick,
}: {
  item: SideNavItem;
  active: boolean;
  showLabel: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{
        alignItems: 'center',
        backgroundColor: active
          ? 'var(--ld-semantic-color-pageNav-fill-activated)'
          : 'var(--ld-semantic-color-pageNav-fill, #ffffff)',
        border: 0,
        color: 'var(--ld-semantic-color-text, #2e2f32)',
        cursor: 'pointer',
        display: 'flex',
        gap: 8,
        height: 40,
        paddingLeft: showLabel ? 16 : 12,
        paddingRight: 6,
        paddingTop: 5,
        paddingBottom: 5,
        position: 'relative',
        width: '100%',
      }}
    >
      {active && (
        <span
          aria-hidden="true"
          style={{
            backgroundColor:
              'var(--ld-semantic-color-pageNav-indicator-activated)',
            borderRadius: 2,
            height: 32,
            left: 0,
            position: 'absolute',
            top: 4,
            width: 3,
          }}
        />
      )}
      <item.Icon width={16} height={16} aria-hidden="true" />
      {showLabel ? (
        <span
          style={{
            alignItems: 'center',
            display: 'flex',
            flex: '1 0 0',
            fontFamily: 'var(--ld-semantic-font-body-small-family)',
            fontSize: 14,
            lineHeight: 'var(--ld-semantic-font-body-small-lineheight, 20px)',
            overflow: 'hidden',
            textAlign: 'left',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.label}
        </span>
      ) : null}

      {showLabel && item.trailingIcon === 'linkExternal' ? (
        <Icon name="LinkExternal" size="small" decorative />
      ) : null}

      {showLabel && item.trailingIcon === 'chevronDown' ? (
        <Icon name="ChevronDown" size="small" decorative />
      ) : null}
    </button>
  );
}

export function SideNav({
  variant,
  activeNavItem,
  onNavChange,
  topNavItems,
  adminNavItem,
  researcherNavItem,
  persona = 'user',
  onToggleVariant,
}: SideNavProps) {
  const isCollapsed = variant === 'collapsed';
  const width = isCollapsed ? 56 : 200;

  return (
    <nav
      aria-label="Main navigation"
      style={{
        backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
        borderRight: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        width,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {topNavItems.map((item) => (
          <NavRow
            key={item.id}
            item={item}
            active={activeNavItem === item.id}
            showLabel={!isCollapsed}
            onClick={() => onNavChange(item.id)}
          />
        ))}

        {(persona === 'admin' ||
          (persona === 'researcher' && researcherNavItem)) && (
          <div style={{ paddingTop: 4, paddingBottom: 4 }}>
            <Divider />
          </div>
        )}

        {persona === 'admin' && (
          <NavRow
            item={adminNavItem}
            active={activeNavItem === adminNavItem.id}
            showLabel={!isCollapsed}
            onClick={() => onNavChange(adminNavItem.id)}
          />
        )}

        {persona === 'researcher' && researcherNavItem && (
          <NavRow
            item={researcherNavItem}
            active={activeNavItem === researcherNavItem.id}
            showLabel={!isCollapsed}
            onClick={() => onNavChange(researcherNavItem.id)}
          />
        )}
      </div>

      <div style={{ flex: '1 0 0', minHeight: 0 }} />

      <div
        style={{
          alignItems: isCollapsed ? 'center' : 'flex-end',
          backgroundColor: 'var(--ld-semantic-color-pageNav-fill, #ffffff)',
          display: 'flex',
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 8,
          paddingRight: 8,
          width: '100%',
        }}
      >
        <button
          type="button"
          onClick={onToggleVariant}
          aria-label={
            isCollapsed ? 'Expand side navigation' : 'Collapse side navigation'
          }
          style={{
            alignItems: 'center',
            backgroundColor: 'transparent',
            border: 0,
            borderRadius: 999,
            color: 'var(--ld-semantic-color-text, #2e2f32)',
            cursor: 'pointer',
            display: 'inline-flex',
            height: 32,
            justifyContent: 'center',
            width: 32,
          }}
        >
          <Icon
            name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'}
            size="small"
            decorative
          />
        </button>
      </div>
    </nav>
  );
}
