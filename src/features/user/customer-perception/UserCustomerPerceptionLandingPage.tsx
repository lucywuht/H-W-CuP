import * as React from 'react';

import {
  Button as LDButton,
  DVPopover,
  DvMenuItem,
  DvTable,
  IconButton as LDIconButton,
  LDIcon,
  Link as DvLink,
  LinkButton as DvLinkButton,
  MenuAction,
  MenuSingleSelect,
  PageHeader,
  Pagination,
} from '@walmart-dataventures/shared-components';
import { getDetailData } from '../../customer-perception/budget/mockData';

import { CreateSurveyModal, SurveyFormData } from './CreateSurveyModal';
import { SurveyAudienceBuilderPage } from './SurveyAudienceBuilderPage';
import { SurveyEntryModal } from './SurveyEntryModal';

type LandingTab = 'all' | 'completed' | 'draft';
type ProjectType = 'Survey' | 'IHUT';
type ProjectStatus =
  | 'Action needed'
  | 'In review'
  | 'Ready to launch'
  | 'Live'
  | 'Draft'
  | 'Completed';

type ProjectRow = {
  id: string;
  iconType: 'article' | 'video';
  projectName: string;
  projectType: ProjectType;
  status: ProjectStatus;
  statusDetail?: string;
  launchDate: string;
  completion: string;
  creator: string;
};

type PaginationItems = '5' | '10' | '15' | '20';
type SortOrder = 'ascending' | 'descending' | 'none';

const USER_ASSIGNED_COST_CENTER_ID = 'cc-sparkling-water';

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const PROJECT_ROWS: ProjectRow[] = [
  {
    id: 'ketchup-survey',
    iconType: 'article',
    projectName: 'Ketchup Survey',
    projectType: 'Survey',
    status: 'Action needed',
    statusDetail: 'Resolve feedback',
    launchDate: 'Apr 12, 2025',
    completion: '--',
    creator: 'Alex Wong',
  },
  {
    id: 'pet-toy-test',
    iconType: 'article',
    projectName: 'Pet Toy Test',
    projectType: 'Survey',
    status: 'In review',
    launchDate: 'Apr 10, 2025',
    completion: '--',
    creator: 'Jason Altman',
  },
  {
    id: 'brand-sentiment',
    iconType: 'video',
    projectName: 'Brand Sentiment',
    projectType: 'IHUT',
    status: 'Ready to launch',
    launchDate: 'Mar 23, 2025',
    completion: '--',
    creator: 'Alex Wong',
  },
  {
    id: 'food-shopping-habit-live',
    iconType: 'article',
    projectName: 'Food Shopping Habit',
    projectType: 'Survey',
    status: 'Live',
    launchDate: 'Feb 18, 2025',
    completion: '190/200',
    creator: 'Madie Smith',
  },
  {
    id: 'food-shopping-habit-draft-1',
    iconType: 'article',
    projectName: 'Food Shopping Habit',
    projectType: 'Survey',
    status: 'Draft',
    launchDate: '--',
    completion: '--',
    creator: 'Alex Wong',
  },
  {
    id: 'food-shopping-habit-draft-2',
    iconType: 'article',
    projectName: 'Food Shopping Habit',
    projectType: 'Survey',
    status: 'Draft',
    launchDate: '--',
    completion: '--',
    creator: 'Alex Wong',
  },
  {
    id: 'in-home-user-test',
    iconType: 'video',
    projectName: 'in-Home User Test Hartz Dog Toy',
    projectType: 'IHUT',
    status: 'Completed',
    launchDate: 'Apr 10, 2024',
    completion: '--',
    creator: 'Alex Wong',
  },
  {
    id: 'pulse-shopping',
    iconType: 'video',
    projectName: 'Pulse on Customer Shopping...',
    projectType: 'IHUT',
    status: 'Completed',
    launchDate: 'Apr 10, 2024',
    completion: '--',
    creator: 'Alex Wong',
  },
];

function sortRows(
  rows: ProjectRow[],
  field: string,
  order: Exclude<SortOrder, 'none'>,
) {
  const sorted = [...rows];

  const parseDate = (value: string) => {
    if (value === '--') {
      return 0;
    }

    return new Date(value).getTime();
  };

  sorted.sort((a, b) => {
    let comparison = 0;

    if (field === 'projectName') {
      comparison = a.projectName.localeCompare(b.projectName);
    } else if (field === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (field === 'launchDate') {
      comparison = parseDate(a.launchDate) - parseDate(b.launchDate);
    } else if (field === 'completion') {
      comparison = a.completion.localeCompare(b.completion);
    } else if (field === 'creator') {
      comparison = a.creator.localeCompare(b.creator);
    }

    return order === 'ascending' ? comparison : -comparison;
  });

  return sorted;
}

type UserCustomerPerceptionLandingPageProps = {
  onEnterOverlayFlow?: (projectName: string) => void;
  onExitOverlayFlow?: () => void;
};

export function UserCustomerPerceptionLandingPage({
  onEnterOverlayFlow,
  onExitOverlayFlow,
}: UserCustomerPerceptionLandingPageProps = {}) {
  const [activeTab, setActiveTab] = React.useState<LandingTab>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProjectType, setSelectedProjectType] = React.useState<
    string | undefined
  >();
  const [selectedStatus, setSelectedStatus] = React.useState<string>();
  const [selectedLaunchDate, setSelectedLaunchDate] = React.useState<
    string | undefined
  >();
  const [selectedCreator, setSelectedCreator] = React.useState<
    string | undefined
  >();
  const [sortAttribute, setSortAttribute] =
    React.useState<string>('launchDate');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('descending');
  const [sorting, setSorting] = React.useState<any[]>([
    { id: 'launchDate', desc: true },
  ]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<PaginationItems>('20');
  const [isCreateSurveyMenuOpen, setIsCreateSurveyMenuOpen] =
    React.useState(false);
  const [hoveredCreateOption, setHoveredCreateOption] = React.useState<
    'survey' | 'video' | null
  >(null);
  const createSurveyTriggerRef = React.useRef<HTMLDivElement>(null);
  const [isSurveyEntryModalOpen, setIsSurveyEntryModalOpen] =
    React.useState(false);
  const [isCreateSurveyModalOpen, setIsCreateSurveyModalOpen] =
    React.useState(false);
  const [isSurveyAudienceBuilderOpen, setIsSurveyAudienceBuilderOpen] =
    React.useState(false);
  const [activeSurveyProjectName, setActiveSurveyProjectName] = React.useState(
    'Untitled survey project',
  );
  const [isBillingPopoverOpen, setIsBillingPopoverOpen] = React.useState(false);
  const billingInformationTriggerRef = React.useRef<HTMLButtonElement>(null);

  const assignedCostCenterBudgetDetail = React.useMemo(
    () => getDetailData(USER_ASSIGNED_COST_CENTER_ID),
    [],
  );

  const billedSeparatelyAmount = React.useMemo(
    () =>
      assignedCostCenterBudgetDetail.purchaseOrders.reduce(
        (total, row) => total + row.billedSeparately,
        0,
      ),
    [assignedCostCenterBudgetDetail.purchaseOrders],
  );

  const costCenterDetailsHref = React.useMemo(() => {
    if (typeof window === 'undefined') {
      return '#';
    }

    const budgetDetailUrl = new URL(window.location.href);
    budgetDetailUrl.searchParams.set('view', 'user-cost-center-budget-detail');
    budgetDetailUrl.searchParams.set(
      'costCenterId',
      USER_ASSIGNED_COST_CENTER_ID,
    );

    return budgetDetailUrl.toString();
  }, []);

  const handleOpenSurveyEntryModal = () => {
    setIsCreateSurveyMenuOpen(false);
    setHoveredCreateOption(null);
    setIsSurveyEntryModalOpen(true);
  };

  const handleStartSurveyFromScratch = () => {
    setIsSurveyEntryModalOpen(false);
    setIsCreateSurveyModalOpen(true);
  };

  const handleCreateSurveySubmit = (formData: SurveyFormData) => {
    const trimmedProjectName = formData.surveyName.trim();
    const resolvedProjectName =
      trimmedProjectName.length > 0
        ? trimmedProjectName
        : 'Untitled survey project';

    if (onEnterOverlayFlow) {
      onEnterOverlayFlow(resolvedProjectName);
      setIsCreateSurveyModalOpen(false);
      return;
    }

    setActiveSurveyProjectName(resolvedProjectName);
    setIsSurveyAudienceBuilderOpen(true);
  };

  const handleExitSurveyAudienceBuilder = () => {
    setIsSurveyAudienceBuilderOpen(false);
    onExitOverlayFlow?.();
  };

  const projectTypeOptions = React.useMemo(
    () =>
      Array.from(new Set(PROJECT_ROWS.map((row) => row.projectType))).map(
        (value) => ({
          id: value,
          label: value,
        }),
      ),
    [],
  );

  const statusOptions = React.useMemo(
    () =>
      Array.from(new Set(PROJECT_ROWS.map((row) => row.status))).map(
        (value) => ({
          id: value,
          label: value,
        }),
      ),
    [],
  );

  const launchDateOptions = React.useMemo(
    () =>
      Array.from(new Set(PROJECT_ROWS.map((row) => row.launchDate)))
        .filter((value) => value !== '--')
        .map((value) => ({
          id: value,
          label: value,
        })),
    [],
  );

  const creatorOptions = React.useMemo(
    () =>
      Array.from(new Set(PROJECT_ROWS.map((row) => row.creator))).map(
        (value) => ({
          id: value,
          label: value,
        }),
      ),
    [],
  );

  const tabRows = React.useMemo(() => {
    if (activeTab === 'completed') {
      return PROJECT_ROWS.filter((row) => row.status === 'Completed');
    }

    if (activeTab === 'draft') {
      return PROJECT_ROWS.filter((row) => row.status === 'Draft');
    }

    return PROJECT_ROWS;
  }, [activeTab]);

  const filteredRows = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return tabRows.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.projectName.toLowerCase().includes(normalizedSearch);

      const matchesProjectType =
        !selectedProjectType || row.projectType === selectedProjectType;
      const matchesStatus = !selectedStatus || row.status === selectedStatus;
      const matchesLaunchDate =
        !selectedLaunchDate || row.launchDate === selectedLaunchDate;
      const matchesCreator =
        !selectedCreator || row.creator === selectedCreator;

      return (
        matchesSearch &&
        matchesProjectType &&
        matchesStatus &&
        matchesLaunchDate &&
        matchesCreator
      );
    });
  }, [
    tabRows,
    searchTerm,
    selectedProjectType,
    selectedStatus,
    selectedLaunchDate,
    selectedCreator,
  ]);

  const sortedRows = React.useMemo(() => {
    if (sortOrder === 'none') {
      return filteredRows;
    }

    return sortRows(filteredRows, sortAttribute, sortOrder);
  }, [filteredRows, sortAttribute, sortOrder]);

  const pageCount = Math.max(
    1,
    Math.ceil(sortedRows.length / Number(itemsPerPage)),
  );
  const safePage = Math.min(currentPage, pageCount);

  const pagedRows = React.useMemo(() => {
    const pageSizeNumber = Number(itemsPerPage);
    const start = (safePage - 1) * pageSizeNumber;
    return sortedRows.slice(start, start + pageSizeNumber);
  }, [sortedRows, safePage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    searchTerm,
    selectedProjectType,
    selectedStatus,
    selectedLaunchDate,
    selectedCreator,
    itemsPerPage,
  ]);

  React.useEffect(() => {
    const activeSort = sorting[0];

    if (!activeSort) {
      setSortOrder('none');
      return;
    }

    setSortAttribute(activeSort.id);
    setSortOrder(activeSort.desc ? 'descending' : 'ascending');
  }, [sorting]);

  const tableRows = React.useMemo(
    () =>
      pagedRows.map((row) => ({
        ...row,
        projectNameHref: '#',
      })),
    [pagedRows],
  );

  const tableColumns = React.useMemo(
    () => [
      {
        accessorKey: 'iconType',
        header: 'Type',
        size: 60,
        enableSorting: false,
        cell: ({ row }: { row: { original: ProjectRow } }) =>
          row.original.iconType === 'article' ? (
            <LDIcon.Article size="small" aria-hidden />
          ) : (
            <LDIcon.Play size="small" aria-hidden />
          ),
      },
      {
        accessorKey: 'projectName',
        header: 'Project name',
        size: 220,
        enableSorting: true,
        cell: ({ row }: { row: { original: ProjectRow } }) => (
          <DvLinkButton href="#">{row.original.projectName}</DvLinkButton>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 170,
        enableSorting: false,
        cell: ({ row }: { row: { original: ProjectRow } }) => (
          <div>
            <div>{row.original.status}</div>
            {row.original.statusDetail ? (
              <div
                style={{
                  color: 'var(--ld-semantic-color-text-subtle, #74767c)',
                  fontSize: 12,
                  lineHeight: '16px',
                }}
              >
                {row.original.statusDetail}
              </div>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'launchDate',
        header: 'Launch date',
        size: 140,
        enableSorting: true,
      },
      {
        accessorKey: 'completion',
        header: 'Completion',
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: 'creator',
        header: 'Creator',
        size: 140,
        enableSorting: true,
      },
      {
        id: 'rowAction',
        header: '',
        size: 160,
        enableSorting: false,
        cell: ({ row }: { row: { original: ProjectRow } }) => {
          if (row.original.status !== 'Action needed') {
            return null;
          }

          return (
            <LDButton variant="tertiary" size="small">
              Review feedback
            </LDButton>
          );
        },
      },
      {
        id: 'more',
        header: '',
        size: 56,
        enableSorting: false,
        cell: ({ row }: { row: { original: ProjectRow } }) => (
          <LDIconButton
            a11yLabel={`More options for ${row.original.projectName}`}
            size="small"
            variant="secondary"
          >
            <LDIcon.More size="small" aria-hidden />
          </LDIconButton>
        ),
      },
    ],
    [],
  );

  return isSurveyAudienceBuilderOpen ? (
    <SurveyAudienceBuilderPage
      projectName={activeSurveyProjectName}
      onBack={handleExitSurveyAudienceBuilder}
    />
  ) : (
    <div
      style={{ backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)' }}
    >
      <PageHeader
        description={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span>
              Create surveys and in-home usage tests to gather valuable customer
              feedback
            </span>
            <div>
              <DVPopover
                isOpen={isBillingPopoverOpen}
                onClose={() => setIsBillingPopoverOpen(false)}
                position="bottomRight"
                hasNubbin
                triggerRef={
                  billingInformationTriggerRef as React.RefObject<HTMLElement>
                }
                aria-label="Billing information summary"
                maxWidth="292px"
                zIndex={1200}
                content={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      width: '252px',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: 'var(--ld-semantic-color-text, #2e2f32)',
                        fontFamily:
                          'var(--ld-semantic-font-body-medium-family)',
                        fontSize:
                          'var(--ld-semantic-font-body-medium-size, 16px)',
                        lineHeight:
                          'var(--ld-semantic-font-body-medium-lineheight, 24px)',
                        fontWeight:
                          'var(--ld-semantic-font-body-medium-weight-alt, 700)',
                      }}
                    >
                      Billing Information
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      {[
                        {
                          label: 'Available balance',
                          value: formatCurrency(
                            assignedCostCenterBudgetDetail.summary
                              .availableBalance,
                          ),
                        },
                        {
                          label: 'Spent amount',
                          value: formatCurrency(
                            assignedCostCenterBudgetDetail.summary.spentAmount,
                          ),
                        },
                        {
                          label: 'Committed amount',
                          value: formatCurrency(
                            assignedCostCenterBudgetDetail.summary
                              .committedAmount,
                          ),
                        },
                        {
                          label: 'Remaining balance',
                          value: formatCurrency(
                            assignedCostCenterBudgetDetail.summary
                              .remainingBalance,
                          ),
                        },
                        {
                          label: 'Billed separately',
                          value: formatCurrency(billedSeparatelyAmount),
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            gap: 12,
                          }}
                        >
                          <span
                            style={{
                              color: 'var(--ld-semantic-color-text, #2e2f32)',
                              fontFamily:
                                'var(--ld-semantic-font-body-small-family)',
                              fontSize:
                                'var(--ld-semantic-font-body-small-size, 14px)',
                              lineHeight:
                                'var(--ld-semantic-font-body-small-lineheight, 20px)',
                              fontWeight:
                                'var(--ld-semantic-font-body-small-weight-default, 400)',
                            }}
                          >
                            {row.label}
                          </span>
                          <span
                            style={{
                              color: 'var(--ld-semantic-color-text, #2e2f32)',
                              fontFamily:
                                'var(--ld-semantic-font-body-medium-family)',
                              fontSize:
                                'var(--ld-semantic-font-body-medium-size, 16px)',
                              lineHeight:
                                'var(--ld-semantic-font-body-medium-lineheight, 24px)',
                              fontWeight:
                                'var(--ld-semantic-font-body-medium-weight-alt, 700)',
                              textAlign: 'right',
                            }}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div style={{ alignSelf: 'flex-start' }}>
                      <DvLinkButton
                        href={costCenterDetailsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        trailing={<LDIcon.LinkExternal size="small" aria-hidden />}
                        onClick={() => setIsBillingPopoverOpen(false)}
                      >
                        View cost center details
                      </DvLinkButton>
                    </div>
                  </div>
                }
              >
                <button
                  type="button"
                  ref={billingInformationTriggerRef}
                  onClick={() =>
                    setIsBillingPopoverOpen((isOpen) => !isOpen)
                  }
                  style={{
                    border: 0,
                    padding: 0,
                    margin: 0,
                    background: 'transparent',
                    color: 'var(--ld-semantic-color-link-text, #2e2f32)',
                    fontFamily: 'var(--ld-semantic-font-body-small-family)',
                    fontSize: 14,
                    lineHeight: '20px',
                    textDecoration: 'underline',
                    textUnderlineOffset: 2,
                    cursor: 'pointer',
                  }}
                  aria-haspopup="dialog"
                  aria-expanded={isBillingPopoverOpen}
                >
                  Billing information
                </button>
              </DVPopover>
            </div>
          </div>
        }
        keyCTAsButtonGroup={[
          <LDButton
            key="partner-with-us"
            variant="secondary"
            size="small"
            leading={<LDIcon.User size="small" aria-hidden />}
          >
            Partner with us
          </LDButton>,
          <MenuAction
            key="create-survey"
            isOpen={isCreateSurveyMenuOpen}
            onClose={() => {
              setIsCreateSurveyMenuOpen(false);
              setHoveredCreateOption(null);
            }}
            onOpen={() => {
              setIsCreateSurveyMenuOpen(true);
              setHoveredCreateOption('survey');
            }}
            position="bottomRight"
            trigger={
              <div
                ref={createSurveyTriggerRef}
                style={{ display: 'inline-flex' }}
              >
                <LDButton
                  variant="primary"
                  size="small"
                  leading={<LDIcon.Plus size="small" aria-hidden />}
                  trailing={<LDIcon.ChevronDown size="small" aria-hidden />}
                  onClick={() =>
                    setIsCreateSurveyMenuOpen((current) => !current)
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setIsCreateSurveyMenuOpen(false);
                      setHoveredCreateOption(null);
                    }
                  }}
                >
                  Create survey
                </LDButton>
              </div>
            }
            triggerRef={createSurveyTriggerRef as React.RefObject<HTMLElement>}
          >
            <div
              onMouseLeave={() => setHoveredCreateOption(null)}
              style={{
                position: 'relative',
                width: 206,
                backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
                boxShadow:
                  '0px -1px 2px rgba(0, 0, 0, 0.1), 0px 5px 5px rgba(0, 0, 0, 0.15)',
                borderRadius: 4,
                overflow: 'visible',
              }}
            >
              <div
                onMouseEnter={() => setHoveredCreateOption('survey')}
                style={{
                  backgroundColor:
                    hoveredCreateOption === 'survey'
                      ? 'var(--ld-semantic-color-surface-subtle, #f8f8f8)'
                      : 'var(--ld-semantic-color-surface, #ffffff)',
                }}
              >
                <DvMenuItem onClick={handleOpenSurveyEntryModal}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <LDIcon.Article size="small" aria-hidden />
                    <span>Survey</span>
                  </span>
                </DvMenuItem>
              </div>

              <div onMouseEnter={() => setHoveredCreateOption('video')}>
                <DvMenuItem
                  onClick={() => {
                    setIsCreateSurveyMenuOpen(false);
                    setHoveredCreateOption(null);
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <LDIcon.Play size="small" aria-hidden />
                    <span>Video survey</span>
                  </span>
                </DvMenuItem>
              </div>

              {hoveredCreateOption === 'survey' && (
                <div
                  style={{
                    position: 'absolute',
                    right: 'calc(100% + 8px)',
                    top: 0,
                    width: 239,
                    backgroundColor:
                      'var(--ld-semantic-color-surface, #ffffff)',
                    borderRadius: 4,
                    boxShadow:
                      '0px -1px 2px rgba(0, 0, 0, 0.1), 0px 5px 5px rgba(0, 0, 0, 0.15)',
                    padding: 16,
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      marginBottom: 4,
                      fontSize: 16,
                      fontWeight: 700,
                      lineHeight: '24px',
                    }}
                  >
                    Survey
                  </div>
                  <div
                    style={{
                      color: 'var(--ld-semantic-color-text-subtlest, #74767c)',
                      fontSize: 14,
                      lineHeight: '20px',
                      marginBottom: 16,
                    }}
                  >
                    Survey Walmart shoppers via form questions
                  </div>

                  <div
                    style={{
                      borderRadius: 12,
                      border:
                        '1px solid var(--ld-semantic-color-border-edited, #6245b7)',
                      backgroundColor:
                        'var(--ld-semantic-color-fill-edited-subtle, #efebf2)',
                      height: 130,
                      padding: 10,
                      display: 'flex',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 49,
                        borderRadius: 7,
                        backgroundColor:
                          'var(--ld-semantic-color-surface, #ffffff)',
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        borderRadius: 7,
                        backgroundColor:
                          'var(--ld-semantic-color-surface, #ffffff)',
                      }}
                    />
                    <div
                      style={{
                        width: 49,
                        borderRadius: 7,
                        backgroundColor:
                          'var(--ld-semantic-color-surface, #ffffff)',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </MenuAction>,
        ]}
        tabNavigation={[
          {
            label: 'All',
            href: '#',
            isCurrent: activeTab === 'all',
            onClick: (event) => {
              event.preventDefault();
              setActiveTab('all');
            },
          },
          {
            label: 'Completed',
            href: '#',
            isCurrent: activeTab === 'completed',
            onClick: (event) => {
              event.preventDefault();
              setActiveTab('completed');
            },
          },
          {
            label: 'Draft',
            href: '#',
            isCurrent: activeTab === 'draft',
            onClick: (event) => {
              event.preventDefault();
              setActiveTab('draft');
            },
          },
        ]}
      >
        Customer Perception
      </PageHeader>

      <div
        className="user-customer-perception-table-wrapper"
        style={{ padding: '0 24px 24px' }}
      >
        <div
          style={{
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
          }}
        >
          <DvTable.Toolbar>
            <DvTable.Search
              placeholder="Search by project name"
              value={searchTerm}
              onSearch={setSearchTerm}
              debounceDelay={0}
            />
            <DvTable.Filters className="survey-activity-filters">
              <MenuSingleSelect
                placeholder="Project type"
                options={projectTypeOptions}
                selectedOptionId={selectedProjectType}
                onSelect={(optionId) =>
                  setSelectedProjectType((current) =>
                    current === optionId ? undefined : optionId,
                  )
                }
                variant="filter"
              />
              <MenuSingleSelect
                placeholder="Status"
                options={statusOptions}
                selectedOptionId={selectedStatus}
                onSelect={(optionId) =>
                  setSelectedStatus((current) =>
                    current === optionId ? undefined : optionId,
                  )
                }
                variant="filter"
              />
              <MenuSingleSelect
                placeholder="Launch date"
                options={launchDateOptions}
                selectedOptionId={selectedLaunchDate}
                onSelect={(optionId) =>
                  setSelectedLaunchDate((current) =>
                    current === optionId ? undefined : optionId,
                  )
                }
                variant="filter"
              />
              <MenuSingleSelect
                placeholder="Creator"
                options={creatorOptions}
                selectedOptionId={selectedCreator}
                onSelect={(optionId) =>
                  setSelectedCreator((current) =>
                    current === optionId ? undefined : optionId,
                  )
                }
                variant="filter"
              />
            </DvTable.Filters>
          </DvTable.Toolbar>

          <DvTable
            columns={tableColumns as any}
            data={tableRows as any}
            compact
            enableSort
            manualSorting
            sorting={sorting}
            onSortingChange={(nextSorting) => setSorting(nextSorting as any)}
            emptyState={{
              title: 'No results found',
              description: 'No projects match the selected filters.',
            }}
            isFilterOrSearchActive={
              searchTerm.trim().length > 0 ||
              !!selectedProjectType ||
              !!selectedStatus ||
              !!selectedLaunchDate ||
              !!selectedCreator
            }
          />

          <div
            style={{
              borderTop:
                '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
              padding: 16,
            }}
          >
            <Pagination
              currentPage={safePage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
              setCurrentPage={(value) => {
                const parsed = Number(value);
                if (!Number.isNaN(parsed)) {
                  setCurrentPage(parsed);
                }
              }}
              totalItemCount={sortedRows.length}
            />
          </div>
        </div>
      </div>
      <CreateSurveyModal
        isOpen={isCreateSurveyModalOpen}
        onClose={() => setIsCreateSurveyModalOpen(false)}
        onSubmit={handleCreateSurveySubmit}
      />
      <SurveyEntryModal
        isOpen={isSurveyEntryModalOpen}
        onClose={() => setIsSurveyEntryModalOpen(false)}
        onStartFromScratch={handleStartSurveyFromScratch}
      />
    </div>
  );
}
