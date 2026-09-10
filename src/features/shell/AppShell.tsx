import * as React from 'react';

import { IconButton } from '../../components/IconButton';
import {
  DvMenuItem,
  MenuAction,
} from '@walmart-dataventures/shared-components';
import { SideNav } from './SideNav';

type SvgProps = React.SVGProps<SVGSVGElement>;

type AppShellNavItem = {
  id: string;
  label: string;
  Icon: React.ComponentType<SvgProps>;
  trailingIcon?: 'chevronDown' | 'linkExternal';
};

function LdQuestionCircleIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <circle cx="8" cy="8" r="6.25" />
      <path d="M6.15 6.2a1.9 1.9 0 113.8 0c0 1.2-1.9 1.65-1.9 3.05" />
      <circle cx="8" cy="11.95" r="0.65" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LdUserIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <circle cx="8" cy="5.1" r="2.25" />
      <path d="M3.35 13.1a4.65 4.65 0 019.3 0" />
    </svg>
  );
}

type AppShellProps = {
  activeNavItem: string;
  onNavChange: (navId: string) => void;
  topNavItems: AppShellNavItem[];
  adminNavItem: AppShellNavItem;
  researcherNavItem?: AppShellNavItem;
  persona?: 'admin' | 'researcher' | 'user';
  onOpenResearcherCompanyBudgets?: () => void;
  onOpenProfile?: () => void;
  children: React.ReactNode;
};

export function AppShell({
  activeNavItem,
  onNavChange,
  topNavItems,
  adminNavItem,
  researcherNavItem,
  persona = 'user',
  onOpenResearcherCompanyBudgets,
  onOpenProfile,
  children,
}: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const profileTriggerRef = React.useRef<HTMLDivElement>(null);
  const isResearcherPersona = persona === 'researcher';

  const profileMenuPanelStyle: React.CSSProperties = {
    width: 248,
    height: 248,
    backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
    borderRadius: 4,
    boxShadow: '0 -1px 2px rgba(0,0,0,0.10), 0 5px 5px rgba(0,0,0,0.15)',
    overflowX: 'hidden',
    overflowY: 'auto',
    paddingTop: 8,
    paddingBottom: 8,
  };

  const divider = (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        width: '100%',
        backgroundColor: 'var(--ld-semantic-color-separator, #e3e4e5)',
      }}
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        backgroundColor: 'var(--ld-semantic-color-background-subtle, #f8f8f8)',
      }}
    >
      <header
        role="banner"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 48,
          paddingLeft: 20,
          paddingRight: 8,
          paddingTop: 4,
          paddingBottom: 4,
          backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
          borderBottom: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
          flexShrink: 0,
          gap: 8,
          zIndex: 10,
        }}
      >
        <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--ld-semantic-font-body-medium-family)',
              fontWeight: 700,
              fontSize: 26,
              color: 'var(--ld-semantic-color-action-fill-primary, #002e99)',
              lineHeight: 1,
            }}
          >
            Scintilla
          </span>
        </div>

        <IconButton a11yLabel="Help" size="medium">
          <LdQuestionCircleIcon />
        </IconButton>
        {isResearcherPersona ? (
          <MenuAction
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
            onOpen={() => setIsProfileMenuOpen(true)}
            position="bottomRight"
            trigger={
              <div ref={profileTriggerRef} style={{ display: 'inline-flex' }}>
                <IconButton
                  a11yLabel="User profile"
                  size="medium"
                  onClick={() => setIsProfileMenuOpen((current) => !current)}
                >
                  <LdUserIcon />
                </IconButton>
              </div>
            }
            triggerRef={profileTriggerRef as React.RefObject<HTMLElement>}
          >
            <div style={profileMenuPanelStyle}>
              <div style={{ padding: '8px 16px' }}>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: '20px',
                    fontWeight: 700,
                    color: 'var(--ld-semantic-color-text, #2e2f32)',
                  }}
                >
                  Sean Dexter
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    lineHeight: '16px',
                    color: 'var(--ld-semantic-color-text, #2e2f32)',
                  }}
                >
                  Super Admin
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    lineHeight: '16px',
                    color: 'var(--ld-semantic-color-text-subtle, #74767c)',
                  }}
                >
                  sean.dexter@walmart.com
                </div>
              </div>

              <DvMenuItem onClick={() => setIsProfileMenuOpen(false)}>
                Researcher view
              </DvMenuItem>

              <div style={{ padding: '8px 0' }}>{divider}</div>

              <DvMenuItem
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onOpenProfile?.();
                }}
              >
                Profile
              </DvMenuItem>
              <DvMenuItem onClick={() => setIsProfileMenuOpen(false)}>
                Admin
              </DvMenuItem>
              <DvMenuItem onClick={() => setIsProfileMenuOpen(false)}>
                Users
              </DvMenuItem>
              <DvMenuItem onClick={() => setIsProfileMenuOpen(false)}>
                Survey billing
              </DvMenuItem>
              <DvMenuItem
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onOpenResearcherCompanyBudgets?.();
                }}
              >
                Company budgets
              </DvMenuItem>

              <div style={{ padding: '8px 0' }}>{divider}</div>

              <DvMenuItem onClick={() => setIsProfileMenuOpen(false)}>
                Log Out
              </DvMenuItem>
            </div>
          </MenuAction>
        ) : (
          <MenuAction
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
            onOpen={() => setIsProfileMenuOpen(true)}
            position="bottomRight"
            trigger={
              <div ref={profileTriggerRef} style={{ display: 'inline-flex' }}>
                <IconButton
                  a11yLabel="User profile"
                  size="medium"
                  onClick={() => setIsProfileMenuOpen((current) => !current)}
                >
                  <LdUserIcon />
                </IconButton>
              </div>
            }
            triggerRef={profileTriggerRef as React.RefObject<HTMLElement>}
          >
            <div style={profileMenuPanelStyle}>
              <div style={{ padding: '8px 16px' }}>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: '20px',
                    fontWeight: 700,
                    color: 'var(--ld-semantic-color-text, #2e2f32)',
                  }}
                >
                  Sean Dexter
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    lineHeight: '16px',
                    color: 'var(--ld-semantic-color-text, #2e2f32)',
                  }}
                >
                  Super Admin
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    lineHeight: '16px',
                    color: 'var(--ld-semantic-color-text-subtle, #74767c)',
                  }}
                >
                  sean.dexter@walmart.com
                </div>
              </div>

              <DvMenuItem
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onOpenProfile?.();
                }}
              >
                Profile
              </DvMenuItem>

              <div style={{ padding: '8px 0' }}>{divider}</div>

              <DvMenuItem onClick={() => setIsProfileMenuOpen(false)}>
                Log Out
              </DvMenuItem>
            </div>
          </MenuAction>
        )}
      </header>

      <div
        style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}
      >
        <SideNav
          variant={isCollapsed ? 'collapsed' : 'expanded'}
          activeNavItem={activeNavItem}
          onNavChange={onNavChange}
          topNavItems={topNavItems}
          adminNavItem={adminNavItem}
          researcherNavItem={researcherNavItem}
          persona={persona}
          onToggleVariant={() => setIsCollapsed((prev) => !prev)}
        />

        <div
          style={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflow: 'auto',
            overscrollBehaviorY: 'contain',
            backgroundColor:
              'var(--ld-semantic-color-background-subtle, #f8f8f8)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
