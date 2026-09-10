import * as React from 'react';

import { Button } from '../../../components/Button';
import { FloatingButton } from '../../../components/FloatingButton';
import { Page } from '../../../components/Page';
import { UsersFillIcon } from '../../../components/Icons';
import {
  ChoiceCard as DvChoiceCard,
  DvIconCart,
  DvIconChart,
  DvIconChecklist,
  DvIconClick,
  DvIconDeveloper,
  DvIconTable,
  DvIconTarget,
  LDIcon,
  PageHeader,
  SpotIcon as DvSpotIcon,
} from '@walmart-dataventures/shared-components';
import '@walmart-dataventures/shared-components/dist/index.css';

import { BudgetDetailPage } from '../../customer-perception/budget/BudgetDetailPage';
import { BudgetOverviewPage } from '../../customer-perception/budget/BudgetOverviewPage';
import {
  customerPerceptionBudgetMockData,
  getDetailData,
  getOverviewData,
} from '../../customer-perception/budget/mockData';
import { AppShell } from '../../shell/AppShell';
import { ResearcherLandingPage } from '../../researcher/dashboard/ResearcherLandingPage';
import { ResearcherCustomerPerceptionLandingPage } from '../../researcher/customer-perception/ResearcherCustomerPerceptionLandingPage';
import { ResearcherCompaniesOverviewPage } from '../../researcher/financial/ResearcherCompaniesOverviewPage';
import { SurveyAudienceBuilderPage } from '../../user/customer-perception/SurveyAudienceBuilderPage';
import { UserCustomerPerceptionLandingPage } from '../../user/customer-perception/UserCustomerPerceptionLandingPage';
import { SurveyBillingPage } from '../../researcher/financial/SurveyBillingPage';
import { AddSingleUserPage } from './AddSingleUserPage';
import { ProfilePage } from './ProfilePage';
import { ScintillaHomePage } from './ScintillaHomePage';
import { UserDetailsPage } from './UserDetailsPage';
import { UserManagementPage } from './UserManagementPage';

type SvgProps = React.SVGProps<SVGSVGElement>;

type AppShellNavItem = {
  id: string;
  label: string;
  Icon: React.ComponentType<SvgProps>;
  trailingIcon?: 'chevronDown' | 'linkExternal';
};

const HomeNavIcon = (props: SvgProps) => (
  <LDIcon.Home width={16} height={16} aria-hidden className={props.className} />
);

const InsightsNavIcon = (props: SvgProps) => (
  <DvIconChart size={16} aria-hidden className={props.className} />
);

const DigitalLandscapesNavIcon = (props: SvgProps) => (
  <DvIconClick size={16} aria-hidden className={props.className} />
);

const ReportBuilderNavIcon = (props: SvgProps) => (
  <DvIconTable size={16} aria-hidden className={props.className} />
);

const ShopperBehaviorNavIcon = (props: SvgProps) => (
  <DvIconCart size={16} aria-hidden className={props.className} />
);

const ChecklistNavIcon = (props: SvgProps) => (
  <DvIconChecklist size={16} aria-hidden className={props.className} />
);

const TargetNavIcon = (props: SvgProps) => (
  <DvIconTarget size={16} aria-hidden className={props.className} />
);

const DeveloperPortalNavIcon = (props: SvgProps) => (
  <DvIconDeveloper size={16} aria-hidden className={props.className} />
);

const SupportNavIcon = (props: SvgProps) => (
  <LDIcon.QuestionCircle
    width={16}
    height={16}
    aria-hidden
    className={props.className}
  />
);

const WrenchNavIcon = (props: SvgProps) => (
  <LDIcon.Wrench
    width={16}
    height={16}
    aria-hidden
    className={props.className}
  />
);

const BriefcaseNavIcon = (props: SvgProps) => (
  <LDIcon.Sliders
    width={16}
    height={16}
    aria-hidden
    className={props.className}
  />
);

const TOP_NAV_ITEMS: AppShellNavItem[] = [
  { id: 'home', label: 'Home', Icon: HomeNavIcon },
  { id: 'insights', label: 'Insights', Icon: InsightsNavIcon },
  {
    id: 'digital-landscapes',
    label: 'Digital Landscapes',
    Icon: DigitalLandscapesNavIcon,
  },
  { id: 'report-builder', label: 'Report Builder', Icon: ReportBuilderNavIcon },
  {
    id: 'shopper-behavior',
    label: 'Shopper Behavior',
    Icon: ShopperBehaviorNavIcon,
    trailingIcon: 'linkExternal',
  },
  {
    id: 'customer-perception',
    label: 'Customer Perception',
    Icon: ChecklistNavIcon,
  },
  {
    id: 'insights-activation',
    label: 'Insights Activation',
    Icon: TargetNavIcon,
  },
  {
    id: 'developer-portal',
    label: 'Developer Portal',
    Icon: DeveloperPortalNavIcon,
  },
  {
    id: 'support',
    label: 'Support',
    Icon: SupportNavIcon,
    trailingIcon: 'chevronDown',
  },
];

type DashboardChoiceCardProps = {
  iconName: React.ComponentProps<typeof DvSpotIcon>['childrenProp'];
  title: string;
  description: string;
  onClick?: () => void;
  groupName: string;
};

function DashboardChoiceCard({
  iconName,
  title,
  description,
  onClick,
  groupName,
}: DashboardChoiceCardProps) {
  return (
    <DvChoiceCard
      inputType="radio"
      name={groupName}
      label={title}
      width={244}
      hideControl
      hideControlLabel
      checked={false}
      onChange={onClick ? () => onClick() : undefined}
      bodyContent={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
          }}
        >
          <DvSpotIcon
            childrenProp={iconName}
            size="small"
            color="purple"
            decorative
          />
          <p
            style={{
              fontFamily:
                "var(--ld-semantic-font-body-small-family, 'Everyday_Sans_UI')",
              fontWeight: 700,
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--ld-semantic-color-text, #2e2f32)',
              margin: 0,
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontFamily:
                "var(--ld-semantic-font-body-small-family, 'Everyday_Sans_UI')",
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--ld-semantic-color-text-subtle, #515357)',
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>
      }
      aria-label={title}
    />
  );
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "var(--ld-semantic-font-body-medium-family, 'Everyday_Sans_UI')",
  fontWeight: 600,
  fontSize: 16,
  lineHeight: '24px',
  color: 'var(--ld-semantic-color-text, #2e2f32)',
  margin: '0 0 12px 0',
};

const cardGridStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
};

const ACCESS_MANAGEMENT_CARDS: Omit<
  DashboardChoiceCardProps,
  'onClick' | 'groupName'
>[] = [
  {
    iconName: 'Users',
    title: 'User Management',
    description:
      'Manage individual or role-based access to Scintilla features and data',
  },
  {
    iconName: 'LockOpen',
    title: 'Authorized Domains',
    description:
      'Whitelist email domains that can be used to create Scintilla accounts for your company',
  },
  {
    iconName: 'Grid',
    title: 'Data Bundles',
    description:
      'Manage metric and dimension groupings used in data access policies',
  },
  {
    iconName: 'Undo',
    title: 'Third Party Permissions',
    description:
      'Define access relationships between suppliers and third party companies',
  },
  {
    iconName: 'Email',
    title: 'Third Party User Access Requests',
    description:
      'Access requests from Walmart employees or third party partners',
  },
  {
    iconName: 'Note',
    title: 'Account Management',
    description: 'Create and manage sub-accounts to divide access',
  },
];

const BUDGET_MANAGEMENT_CARDS: Omit<
  DashboardChoiceCardProps,
  'onClick' | 'groupName'
>[] = [
  {
    iconName: 'Dollar',
    title: 'Customer Perception Budget',
    description: 'Manage budgets that can be used to submit surveys',
  },
];

const GENERAL_CARDS: Omit<DashboardChoiceCardProps, 'onClick' | 'groupName'>[] =
  [
    {
      iconName: 'Calendar',
      title: 'Activity Log',
      description: 'See a log of administrative and app level updates',
    },
  ];

type Persona = 'admin' | 'researcher' | 'user';

const PERSONA_SELECTOR_OPTIONS: Array<{ id: Persona; label: string }> = [
  { id: 'admin', label: 'Admin' },
  { id: 'researcher', label: 'Researcher' },
  { id: 'user', label: 'User' },
];

const ADMIN_DASHBOARD_VIEW_STATE_KEY = 'admin-dashboard:view-state';

type AdminDashboardViewState = {
  activeNavItem: string;
  activePersona: Persona;
  activeContractYearId: string;
  selectedCostCenterId: string | null;
  selectedCompanyId: string | null;
  selectedCompanyName: string | null;
  selectedUserId: string | null;
  selectedUserName: string | null;
  isUserCustomerPerceptionOverlayFlow: boolean;
  userCustomerPerceptionOverlayProjectName: string;
};

type AdminDashboardHistoryState = {
  adminDashboardViewState: AdminDashboardViewState;
};

const USER_BUDGET_DETAIL_DEFAULT_COST_CENTER_ID = 'cc-sparkling-water';

function getInitialAdminDashboardViewState(): AdminDashboardViewState {
  const fallback: AdminDashboardViewState = {
    activeNavItem: 'admin',
    activePersona: 'admin',
    activeContractYearId: 'year-2-active',
    selectedCostCenterId: null,
    selectedCompanyId: null,
    selectedCompanyName: null,
    selectedUserId: null,
    selectedUserName: null,
    isUserCustomerPerceptionOverlayFlow: false,
    userCustomerPerceptionOverlayProjectName: 'Untitled survey project',
  };

  if (typeof window === 'undefined') {
    return fallback;
  }

  const initialUrlSearchParams = new URLSearchParams(window.location.search);
  if (
    initialUrlSearchParams.get('view') === 'user-cost-center-budget-detail'
  ) {
    const deepLinkedCostCenterId =
      initialUrlSearchParams.get('costCenterId') ??
      USER_BUDGET_DETAIL_DEFAULT_COST_CENTER_ID;

    return {
      ...fallback,
      activeNavItem: 'user-cost-center-budget-detail',
      activePersona: 'user',
      selectedCostCenterId: deepLinkedCostCenterId,
    };
  }

  try {
    const stored = window.sessionStorage.getItem(
      ADMIN_DASHBOARD_VIEW_STATE_KEY,
    );
    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored) as Partial<AdminDashboardViewState>;
    const persona =
      parsed.activePersona === 'admin' ||
      parsed.activePersona === 'researcher' ||
      parsed.activePersona === 'user'
        ? parsed.activePersona
        : fallback.activePersona;

    return {
      activeNavItem:
        typeof parsed.activeNavItem === 'string'
          ? parsed.activeNavItem
          : fallback.activeNavItem,
      activePersona: persona,
      activeContractYearId:
        typeof parsed.activeContractYearId === 'string'
          ? parsed.activeContractYearId
          : fallback.activeContractYearId,
      selectedCostCenterId:
        typeof parsed.selectedCostCenterId === 'string'
          ? parsed.selectedCostCenterId
          : null,
      selectedCompanyId:
        typeof parsed.selectedCompanyId === 'string'
          ? parsed.selectedCompanyId
          : null,
      selectedCompanyName:
        typeof parsed.selectedCompanyName === 'string'
          ? parsed.selectedCompanyName
          : null,
      selectedUserId:
        typeof parsed.selectedUserId === 'string'
          ? parsed.selectedUserId
          : null,
      selectedUserName:
        typeof parsed.selectedUserName === 'string'
          ? parsed.selectedUserName
          : null,
      isUserCustomerPerceptionOverlayFlow:
        typeof parsed.isUserCustomerPerceptionOverlayFlow === 'boolean'
          ? parsed.isUserCustomerPerceptionOverlayFlow
          : fallback.isUserCustomerPerceptionOverlayFlow,
      userCustomerPerceptionOverlayProjectName:
        typeof parsed.userCustomerPerceptionOverlayProjectName === 'string'
          ? parsed.userCustomerPerceptionOverlayProjectName
          : fallback.userCustomerPerceptionOverlayProjectName,
    };
  } catch {
    return fallback;
  }
}

function PersonaFloatingSelector({
  activePersona,
  onSelectPersona,
}: {
  activePersona: Persona;
  onSelectPersona: (persona: Persona) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {isOpen ? (
        <div
          role="dialog"
          aria-label="Choose persona"
          style={{
            width: 176,
            padding: 8,
            borderRadius: 12,
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            boxShadow: '0 5px 10px 3px #00000026, 0 -1px 4px 0 #0000001A',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {PERSONA_SELECTOR_OPTIONS.map((option) => (
            <Button
              key={option.id}
              variant={activePersona === option.id ? 'primary' : 'secondary'}
              size="small"
              onClick={() => {
                onSelectPersona(option.id);
                setIsOpen(false);
              }}
              aria-label={`Switch persona to ${option.label}`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      ) : null}

      <FloatingButton
        aria-label="Toggle persona selector"
        size="small"
        onClick={() => setIsOpen((current) => !current)}
      >
        <UsersFillIcon size="small" decorative />
      </FloatingButton>
    </div>
  );
}

function SideNavPlaceholderContent({
  title,
  activePersona,
}: {
  title: string;
  activePersona: Persona;
}) {
  return (
    <>
      <div
        style={{ backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)' }}
      >
        <PageHeader description="Placeholder content for this side navigation page">
          {title}
        </PageHeader>
      </div>

      <div style={{ padding: 24 }}>
        <div
          style={{
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            padding: 16,
            maxWidth: 560,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--ld-semantic-color-text-subtle, #515357)',
            }}
          >
            Placeholder content for {title}. Current persona: {activePersona}.
          </p>
        </div>
      </div>
    </>
  );
}

type AdminDashboardContentProps = {
  onOpenCustomerPerceptionBudget: () => void;
  onOpenUserManagement: () => void;
};

function AdminDashboardContent({
  onOpenCustomerPerceptionBudget,
  onOpenUserManagement,
}: AdminDashboardContentProps) {
  return (
    <>
      <div
        style={{ backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)' }}
      >
        <PageHeader description="Manage access and general settings across Scintilla suppliers">
          Pepsi.co Company Admin
        </PageHeader>
      </div>

      <div
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <section aria-labelledby="section-access">
          <h2 id="section-access" style={sectionTitleStyle}>
            Access management
          </h2>
          <div style={cardGridStyle}>
            {ACCESS_MANAGEMENT_CARDS.map((card) => {
              const isUserManagement = card.title === 'User Management';

              return (
                <DashboardChoiceCard
                  key={card.title}
                  {...card}
                  groupName="admin-access-management"
                  onClick={isUserManagement ? onOpenUserManagement : undefined}
                />
              );
            })}
          </div>
        </section>

        <section aria-labelledby="section-budget">
          <h2 id="section-budget" style={sectionTitleStyle}>
            Budget management
          </h2>
          <div style={cardGridStyle}>
            {BUDGET_MANAGEMENT_CARDS.map((card) => {
              const isCustomerPerception =
                card.title === 'Customer Perception Budget';

              return (
                <DashboardChoiceCard
                  key={card.title}
                  {...card}
                  groupName="admin-budget-management"
                  onClick={
                    isCustomerPerception
                      ? onOpenCustomerPerceptionBudget
                      : undefined
                  }
                />
              );
            })}
          </div>
        </section>

        <section aria-labelledby="section-general">
          <h2 id="section-general" style={sectionTitleStyle}>
            General
          </h2>
          <div style={cardGridStyle}>
            {GENERAL_CARDS.map((card) => (
              <DashboardChoiceCard
                key={card.title}
                {...card}
                groupName="admin-general"
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export function AdminDashboard() {
  const initialViewState = React.useMemo(
    () => getInitialAdminDashboardViewState(),
    [],
  );
  const isHandlingPopStateRef = React.useRef(false);
  const hasInitializedHistoryRef = React.useRef(false);

  const [activeNavItem, setActiveNavItem] = React.useState(
    initialViewState.activeNavItem,
  );
  const [activePersona, setActivePersona] = React.useState<Persona>(
    initialViewState.activePersona,
  );
  const [activeContractYearId, setActiveContractYearId] = React.useState(
    initialViewState.activeContractYearId,
  );
  const [selectedCostCenterId, setSelectedCostCenterId] = React.useState<
    string | null
  >(initialViewState.selectedCostCenterId);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<
    string | null
  >(initialViewState.selectedCompanyId);
  const [selectedCompanyName, setSelectedCompanyName] = React.useState<
    string | null
  >(initialViewState.selectedCompanyName);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
    initialViewState.selectedUserId,
  );
  const [selectedUserName, setSelectedUserName] = React.useState<string | null>(
    initialViewState.selectedUserName,
  );
  const [selectedUserEmail, setSelectedUserEmail] = React.useState<
    string | null
  >(null);
  const [addedUserName, setAddedUserName] = React.useState<string | null>(null);
  const [
    isUserCustomerPerceptionOverlayFlow,
    setIsUserCustomerPerceptionOverlayFlow,
  ] = React.useState(initialViewState.isUserCustomerPerceptionOverlayFlow);
  const [
    userCustomerPerceptionOverlayProjectName,
    setUserCustomerPerceptionOverlayProjectName,
  ] = React.useState(initialViewState.userCustomerPerceptionOverlayProjectName);

  const currentViewState = React.useMemo<AdminDashboardViewState>(
    () => ({
      activeNavItem,
      activePersona,
      activeContractYearId,
      selectedCostCenterId,
      selectedCompanyId,
      selectedCompanyName,
      selectedUserId,
      selectedUserName,
      isUserCustomerPerceptionOverlayFlow,
      userCustomerPerceptionOverlayProjectName,
    }),
    [
      activeNavItem,
      activePersona,
      activeContractYearId,
      selectedCostCenterId,
      selectedCompanyId,
      selectedCompanyName,
      selectedUserId,
      selectedUserName,
      isUserCustomerPerceptionOverlayFlow,
      userCustomerPerceptionOverlayProjectName,
    ],
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(
      ADMIN_DASHBOARD_VIEW_STATE_KEY,
      JSON.stringify(currentViewState),
    );
  }, [currentViewState]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const historyState: AdminDashboardHistoryState = {
      adminDashboardViewState: currentViewState,
    };

    if (!hasInitializedHistoryRef.current) {
      window.history.replaceState(historyState, '');
      hasInitializedHistoryRef.current = true;
      return;
    }

    if (isHandlingPopStateRef.current) {
      isHandlingPopStateRef.current = false;
      return;
    }

    window.history.pushState(historyState, '');
  }, [currentViewState]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePopState = (event: PopStateEvent) => {
      const historyState = (event.state as AdminDashboardHistoryState | null)
        ?.adminDashboardViewState;

      if (!historyState) {
        return;
      }

      isHandlingPopStateRef.current = true;
      setActiveNavItem(historyState.activeNavItem);
      setActivePersona(historyState.activePersona);
      setActiveContractYearId(historyState.activeContractYearId);
      setSelectedCostCenterId(historyState.selectedCostCenterId);
      setSelectedCompanyId(historyState.selectedCompanyId);
      setSelectedCompanyName(historyState.selectedCompanyName);
      setSelectedUserId(historyState.selectedUserId);
      setSelectedUserName(historyState.selectedUserName);
      setAddedUserName(null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const isHomePage = activeNavItem === 'home';
  const isAdminMenu = activeNavItem === 'admin';
  const isCustomerPerceptionOverview =
    activeNavItem === 'admin-customer-perception';
  const isCustomerPerceptionDetail =
    activeNavItem === 'admin-customer-perception-detail';
  const isUserManagementPage = activeNavItem === 'admin-user-management';
  const isUserDetailsPage = activeNavItem === 'admin-user-details';
  const isAddSingleUserPage =
    activeNavItem === 'admin-user-management-add-single';
  const isProfilePage = activeNavItem === 'admin-profile';
  const isResearcherLandingPage = activeNavItem === 'researcher';
  const isResearcherSurveyBillingPage =
    activeNavItem === 'researcher-survey-billing';
  const isResearcherCompaniesOverviewPage =
    activeNavItem === 'researcher-company-budgets';
  const isResearcherBudgetOverviewPage =
    activeNavItem === 'researcher-company-budget-overview';
  const isResearcherBudgetDetailPage =
    activeNavItem === 'researcher-company-budget-detail';
  const isResearcherCustomerPerceptionLandingPage =
    activePersona === 'researcher' && activeNavItem === 'customer-perception';
  const isUserCustomerPerceptionLandingPage =
    activePersona === 'user' && activeNavItem === 'customer-perception';
  const isUserCostCenterBudgetDetailPage =
    activePersona === 'user' &&
    activeNavItem === 'user-cost-center-budget-detail';

  const shouldUseOverlayOnlyLayout =
    isUserCustomerPerceptionLandingPage && isUserCustomerPerceptionOverlayFlow;

  const shouldShowAdminDashboardContent =
    isAdminMenu && activePersona === 'admin';

  const shellActiveNavItem =
    isCustomerPerceptionOverview ||
    isCustomerPerceptionDetail ||
    isUserCostCenterBudgetDetailPage ||
    isUserManagementPage ||
    isUserDetailsPage ||
    isProfilePage ||
    isAddSingleUserPage
      ? 'admin'
      : activeNavItem;

  const placeholderTitle = React.useMemo(() => {
    if (isAdminMenu) {
      return 'Admin';
    }

    return (
      TOP_NAV_ITEMS.find((item) => item.id === activeNavItem)?.label ?? 'Page'
    );
  }, [activeNavItem, isAdminMenu]);

  const overviewData = React.useMemo(
    () => getOverviewData(activeContractYearId),
    [activeContractYearId],
  );

  const detailData = React.useMemo(
    () => getDetailData(selectedCostCenterId ?? 'cc-sparkling-water'),
    [selectedCostCenterId],
  );

  const researcherOverviewData = React.useMemo(
    () => getOverviewData(activeContractYearId),
    [activeContractYearId],
  );

  const researcherDetailData = React.useMemo(
    () => getDetailData(selectedCostCenterId ?? 'cc-sparkling-water'),
    [selectedCostCenterId],
  );

  const contractYearOptions =
    customerPerceptionBudgetMockData.contractYears.map((year) => ({
      id: year.id,
      label: year.label,
    }));

  const activeContractYearLabel =
    customerPerceptionBudgetMockData.contractYears.find(
      (year) => year.id === activeContractYearId,
    )?.label ?? 'Year 2 - active contract';

  const handleOpenCustomerPerceptionBudget = React.useCallback(() => {
    setActiveNavItem('admin-customer-perception');
    setSelectedCostCenterId(null);
    setSelectedCompanyName(null);
  }, []);

  const handleOpenUserManagement = React.useCallback(() => {
    setActiveNavItem('admin-user-management');
    setSelectedCostCenterId(null);
    setSelectedCompanyName(null);
    setSelectedUserId(null);
    setSelectedUserName(null);
  }, []);

  const handleOpenUserDetails = React.useCallback(
    (userId: string, userName: string) => {
      setSelectedUserId(userId);
      setSelectedUserName(userName);
      setActiveNavItem('admin-user-details');
      setSelectedCostCenterId(null);
      setSelectedCompanyName(null);
    },
    [],
  );

  const handleSaveSingleUser = React.useCallback((fullName: string) => {
    setAddedUserName(fullName);
    setActiveNavItem('admin-user-management');
    setSelectedCostCenterId(null);
  }, []);

  const handleSaveProfile = React.useCallback((fullName: string) => {
    setAddedUserName(fullName);
    setActiveNavItem('admin-user-management');
    setSelectedCostCenterId(null);
    setSelectedCompanyName(null);
    setSelectedUserId(null);
    setSelectedUserName(null);
  }, []);

  const handleAddedUserNoticeShown = React.useCallback(() => {
    setAddedUserName(null);
  }, []);

  const handleOpenAddSingleUser = React.useCallback(() => {
    setActiveNavItem('admin-user-management-add-single');
    setSelectedCostCenterId(null);
    setSelectedCompanyName(null);
    setSelectedUserId(null);
    setSelectedUserName(null);
  }, []);

  const handleOpenProfilePage = React.useCallback(
    (userId?: string, userName?: string, userEmail?: string) => {
      setActiveNavItem('admin-profile');
      setSelectedCostCenterId(null);
      setSelectedCompanyName(null);
      setSelectedUserId(userId ?? null);
      setSelectedUserName(userName ?? null);
      setSelectedUserEmail(userEmail ?? null);
    },
    [],
  );

  const handleOpenCostCenter = React.useCallback((costCenterId: string) => {
    setSelectedCostCenterId(costCenterId);
    setActiveNavItem('admin-customer-perception-detail');
    setSelectedCompanyName(null);
  }, []);

  const handleBackToOverview = React.useCallback(() => {
    setActiveNavItem('admin-customer-perception');
    setSelectedCompanyName(null);
  }, []);

  const handleNavigateToAdmin = React.useCallback(() => {
    setActiveNavItem('admin');
    setSelectedCostCenterId(null);
    setSelectedCompanyId(null);
    setSelectedCompanyName(null);
    setSelectedUserId(null);
    setSelectedUserName(null);
  }, []);

  const handleOpenResearcherCompanyBudgets = React.useCallback(() => {
    setActivePersona('researcher');
    setActiveNavItem('researcher-company-budgets');
    setSelectedCompanyId(null);
    setSelectedCostCenterId(null);
    setSelectedCompanyName(null);
  }, []);

  const handleOpenResearcherBudgetOverview = React.useCallback(
    (companyId: string, companyName: string) => {
      setActivePersona('researcher');
      setSelectedCompanyId(companyId);
      setSelectedCompanyName(companyName);
      setSelectedCostCenterId(null);
      setActiveNavItem('researcher-company-budget-overview');
    },
    [],
  );

  const handleOpenResearcherCostCenter = React.useCallback(
    (costCenterId: string) => {
      setSelectedCostCenterId(costCenterId);
      setActiveNavItem('researcher-company-budget-detail');
    },
    [],
  );

  const handleBackToResearcherCompaniesOverview = React.useCallback(() => {
    setActiveNavItem('researcher-company-budgets');
    setSelectedCostCenterId(null);
    setSelectedCompanyName(null);
  }, []);

  const handleBackToResearcherBudgetOverview = React.useCallback(() => {
    setActiveNavItem('researcher-company-budget-overview');
  }, []);

  const handleOpenResearcherLanding = React.useCallback(() => {
    setActivePersona('researcher');
    setActiveNavItem('researcher');
    setSelectedCompanyId(null);
    setSelectedCostCenterId(null);
    setSelectedCompanyName(null);
  }, []);

  const handleOpenResearcherSurveyBilling = React.useCallback(() => {
    setActivePersona('researcher');
    setActiveNavItem('researcher-survey-billing');
    setSelectedCompanyId(null);
    setSelectedCostCenterId(null);
    setSelectedCompanyName(null);
  }, []);

  const handleSelectPersonaAndGoHome = React.useCallback((persona: Persona) => {
    setActivePersona(persona);
    setActiveNavItem('home');
    setIsUserCustomerPerceptionOverlayFlow(false);
    setSelectedCompanyId(null);
    setSelectedCostCenterId(null);
    setSelectedCompanyName(null);
    setSelectedUserId(null);
    setSelectedUserName(null);
  }, []);

  const researcherCompanyName = React.useMemo(() => {
    if (selectedCompanyName) {
      return selectedCompanyName;
    }

    if (!selectedCompanyId) {
      return 'Company';
    }

    return selectedCompanyId
      .split('-')
      .filter(Boolean)
      .map(
        (segment) =>
          segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase(),
      )
      .join(' ');
  }, [selectedCompanyId, selectedCompanyName]);

  const researcherBudgetPageTitle = React.useMemo(
    () => `${researcherCompanyName} - Customer Perception Budget`,
    [researcherCompanyName],
  );

  const researcherBudgetDetailTitle = React.useMemo(
    () => researcherDetailData.costCenterName,
    [researcherDetailData.costCenterName],
  );

  const userCostCenterBudgetDetailData = React.useMemo(
    () =>
      getDetailData(
        selectedCostCenterId ?? USER_BUDGET_DETAIL_DEFAULT_COST_CENTER_ID,
      ),
    [selectedCostCenterId],
  );

  return (
    <Page
      title="Pepsi.co Company Admin"
      titleVisuallyHidden
      UNSAFE_style={{
        height: '100vh',
        overflow: shouldUseOverlayOnlyLayout ? 'auto' : 'hidden',
      }}
    >
      {shouldUseOverlayOnlyLayout ? (
        <SurveyAudienceBuilderPage
          projectName={userCustomerPerceptionOverlayProjectName}
          onBack={() => setIsUserCustomerPerceptionOverlayFlow(false)}
        />
      ) : (
        <AppShell
          activeNavItem={shellActiveNavItem}
          onNavChange={setActiveNavItem}
          topNavItems={TOP_NAV_ITEMS}
          adminNavItem={{ id: 'admin', label: 'Admin', Icon: WrenchNavIcon }}
          researcherNavItem={{
            id: 'researcher',
            label: 'Researcher tools',
            Icon: BriefcaseNavIcon,
          }}
          persona={activePersona}
          onOpenResearcherCompanyBudgets={handleOpenResearcherCompanyBudgets}
          onOpenProfile={handleOpenProfilePage}
        >
          {isHomePage ? (
            <ScintillaHomePage />
          ) : isCustomerPerceptionOverview ? (
            <BudgetOverviewPage
              data={overviewData}
              contractYearLabel={activeContractYearLabel}
              onChangeContractYear={setActiveContractYearId}
              contractYearOptions={contractYearOptions}
              onOpenCostCenter={handleOpenCostCenter}
              onNavigateToAdmin={handleNavigateToAdmin}
            />
          ) : isCustomerPerceptionDetail ? (
            <BudgetDetailPage
              data={detailData}
              onBackToOverview={handleBackToOverview}
              onNavigateToAdmin={handleNavigateToAdmin}
            />
          ) : isUserManagementPage ? (
            <UserManagementPage
              onNavigateToAdmin={handleNavigateToAdmin}
              onNavigateToAddSingleUser={handleOpenAddSingleUser}
              onOpenUserDetails={handleOpenProfilePage}
              addedUserName={addedUserName}
              onAddedUserNoticeShown={handleAddedUserNoticeShown}
            />
          ) : isProfilePage ? (
            <ProfilePage
              onNavigateToAdmin={handleNavigateToAdmin}
              onNavigateToUserManagement={handleOpenUserManagement}
              onSaveProfile={handleSaveProfile}
              userName={selectedUserName ?? 'John Doe'}
              userEmail={selectedUserEmail ?? 'john.doe@hotmail.com'}
            />
          ) : isUserDetailsPage ? (
            <UserDetailsPage
              userId={selectedUserId ?? 'user-1'}
              userName={selectedUserName ?? 'User Details'}
              userEmail={selectedUserEmail ?? 'user@example.com'}
              onNavigateToAdmin={handleNavigateToAdmin}
              onBackToUserManagement={handleOpenUserManagement}
            />
          ) : isAddSingleUserPage ? (
            <AddSingleUserPage
              onNavigateToAdmin={handleNavigateToAdmin}
              onNavigateToUserManagement={handleOpenUserManagement}
              onSaveUser={handleSaveSingleUser}
            />
          ) : isResearcherLandingPage ? (
            <ResearcherLandingPage
              onOpenSurveyBilling={handleOpenResearcherSurveyBilling}
              onOpenCompanyBudgets={handleOpenResearcherCompanyBudgets}
            />
          ) : isResearcherSurveyBillingPage ? (
            <SurveyBillingPage
              onNavigateToResearcher={handleOpenResearcherLanding}
            />
          ) : isResearcherCustomerPerceptionLandingPage ? (
            <ResearcherCustomerPerceptionLandingPage />
          ) : isUserCustomerPerceptionLandingPage ? (
            <UserCustomerPerceptionLandingPage
              onEnterOverlayFlow={(projectName) => {
                setUserCustomerPerceptionOverlayProjectName(projectName);
                setIsUserCustomerPerceptionOverlayFlow(true);
              }}
            />
          ) : isUserCostCenterBudgetDetailPage ? (
            <BudgetDetailPage
              data={userCostCenterBudgetDetailData}
              onBackToOverview={() => {
                setActivePersona('user');
                setActiveNavItem('customer-perception');
              }}
              onNavigateToAdmin={() => {
                setActivePersona('user');
                setActiveNavItem('customer-perception');
              }}
              rootBreadcrumbLabel={null}
              overviewBreadcrumbLabel="Customer Perception"
              currentBreadcrumbLabel={
                userCostCenterBudgetDetailData.costCenterName
              }
              pageTitle={userCostCenterBudgetDetailData.costCenterName}
              pageDescription="Shows the details of the cost center"
              showAssignUserCTA={false}
              showAssignedUserRowActions={false}
            />
          ) : isResearcherCompaniesOverviewPage ? (
            <ResearcherCompaniesOverviewPage
              onOpenCompanyBudget={handleOpenResearcherBudgetOverview}
              onNavigateToResearcher={handleOpenResearcherLanding}
            />
          ) : isResearcherBudgetOverviewPage ? (
            <BudgetOverviewPage
              data={researcherOverviewData}
              contractYearLabel={activeContractYearLabel}
              onChangeContractYear={setActiveContractYearId}
              contractYearOptions={contractYearOptions}
              onOpenCostCenter={handleOpenResearcherCostCenter}
              onNavigateToAdmin={handleOpenResearcherLanding}
              onNavigateToIntermediate={handleBackToResearcherCompaniesOverview}
              rootBreadcrumbLabel="Researcher tools"
              intermediateBreadcrumbLabel="Company budgets"
              currentBreadcrumbLabel={researcherCompanyName}
              pageTitle={researcherBudgetPageTitle}
              pageDescription="Manage budgets across company cost centers"
              companyTag={researcherCompanyName}
            />
          ) : isResearcherBudgetDetailPage ? (
            <BudgetDetailPage
              data={researcherDetailData}
              onBackToOverview={handleBackToResearcherCompaniesOverview}
              onNavigateToAdmin={handleOpenResearcherLanding}
              rootBreadcrumbLabel="Researcher tools"
              overviewBreadcrumbLabel="Company budgets"
              companyBreadcrumbLabel={researcherCompanyName}
              onBackToCompanyBudgetOverview={
                handleBackToResearcherBudgetOverview
              }
              currentBreadcrumbLabel={researcherBudgetDetailTitle}
              pageTitle={researcherBudgetDetailTitle}
              pageDescription="Shows the details of the selected company cost center"
              showAssignUserCTA={false}
              showAssignedUserRowActions={false}
              companyTag={researcherCompanyName}
            />
          ) : shouldShowAdminDashboardContent ? (
            <AdminDashboardContent
              onOpenCustomerPerceptionBudget={
                handleOpenCustomerPerceptionBudget
              }
              onOpenUserManagement={handleOpenUserManagement}
            />
          ) : (
            <SideNavPlaceholderContent
              title={placeholderTitle}
              activePersona={activePersona}
            />
          )}
        </AppShell>
      )}

      <PersonaFloatingSelector
        activePersona={activePersona}
        onSelectPersona={handleSelectPersonaAndGoHome}
      />
    </Page>
  );
}
