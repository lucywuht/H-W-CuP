import * as React from 'react';

import {
  Button as LDButton,
  DvTable,
  LDIcon,
  MenuSingleSelect,
  PageHeader,
} from '@walmart-dataventures/shared-components';

import { TablePagination } from '../../../patterns/TablePagination/TablePagination';

type LandingPageTab =
  | 'survey-pending-queue'
  | 'ihut-pending-queue'
  | 'all-projects'
  | 'all-ihut';

type ProjectStage = 'active' | 'pending' | 'drafts' | 'closed';
type ProjectType = 'Survey' | 'IHUT';

type ProjectRow = {
  id: string;
  iconType: 'survey' | 'ihut';
  projectType: ProjectType;
  projectName: string;
  company: string;
  submittedBy: string;
  completion: number;
  completionTotal: number;
  launchDate: string;
  stage: ProjectStage;
};

const PROJECT_ROWS: ProjectRow[] = [
  {
    id: 'ketchup-survey',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Ketchup Survey',
    company: 'Sanofi',
    submittedBy: 'Alex Wong',
    completion: 34,
    completionTotal: 50,
    launchDate: 'Apr 10, 2025',
    stage: 'active',
  },
  {
    id: 'pet-toy-test',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Pet Toy Test',
    company: 'Anonymous',
    submittedBy: 'Jason Altman',
    completion: 12,
    completionTotal: 50,
    launchDate: 'Apr 10, 2025',
    stage: 'active',
  },
  {
    id: 'brand-sentiment',
    iconType: 'ihut',
    projectType: 'IHUT',
    projectName: 'Brand Sentiment',
    company: 'Anonymous',
    submittedBy: 'Madie Smith',
    completion: 13,
    completionTotal: 50,
    launchDate: 'Apr 10, 2025',
    stage: 'active',
  },
  {
    id: 'food-shopping-habit-1',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Food Shopping Habit',
    company: 'Sanofi',
    submittedBy: 'Alex Wong',
    completion: 0,
    completionTotal: 50,
    launchDate: 'Apr 10, 2025',
    stage: 'active',
  },
  {
    id: 'food-shopping-habit-2',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Food Shopping Habit',
    company: 'Sanofi',
    submittedBy: 'Jason Altman',
    completion: 12,
    completionTotal: 50,
    launchDate: 'Apr 10, 2025',
    stage: 'active',
  },
  {
    id: 'food-shopping-habit-3',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Food Shopping Habit',
    company: 'Brilliant MMj Lnc.',
    submittedBy: 'Alex Wong',
    completion: 22,
    completionTotal: 50,
    launchDate: 'Apr 10, 2025',
    stage: 'pending',
  },
  {
    id: 'pulse-customer-shopping',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Pulse on Customer Shopping...',
    company: 'Walmart Test Supplier',
    submittedBy: 'Alex Wong',
    completion: 44,
    completionTotal: 50,
    launchDate: 'Apr 10, 2025',
    stage: 'closed',
  },
  {
    id: 'packaging-design-study',
    iconType: 'ihut',
    projectType: 'IHUT',
    projectName: 'Packaging Design Study',
    company: 'Nestlé',
    submittedBy: 'Sarah Johnson',
    completion: 8,
    completionTotal: 25,
    launchDate: 'May 15, 2025',
    stage: 'active',
  },
  {
    id: 'retail-experience-test',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Retail Experience Test',
    company: 'PepsiCo',
    submittedBy: 'Michael Chen',
    completion: 0,
    completionTotal: 40,
    launchDate: 'Jun 01, 2025',
    stage: 'pending',
  },
  {
    id: 'product-feedback-survey',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Product Feedback Survey',
    company: 'Anonymous',
    submittedBy: 'Emily Davis',
    completion: 32,
    completionTotal: 50,
    launchDate: 'Apr 20, 2025',
    stage: 'active',
  },
  {
    id: 'store-layout-ihut',
    iconType: 'ihut',
    projectType: 'IHUT',
    projectName: 'Store Layout IHUT',
    company: 'Unilever',
    submittedBy: 'James Wilson',
    completion: 5,
    completionTotal: 30,
    launchDate: 'May 22, 2025',
    stage: 'drafts',
  },
  {
    id: 'consumer-preference-study',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Consumer Preference Study',
    company: 'Brilliant MMj Lnc.',
    submittedBy: 'Lisa Anderson',
    completion: 48,
    completionTotal: 50,
    launchDate: 'Mar 15, 2025',
    stage: 'closed',
  },
  {
    id: 'digital-experience-test',
    iconType: 'ihut',
    projectType: 'IHUT',
    projectName: 'Digital Experience Test',
    company: 'Walmart Test Supplier',
    submittedBy: 'Robert Taylor',
    completion: 0,
    completionTotal: 35,
    launchDate: 'Jun 10, 2025',
    stage: 'drafts',
  },
  {
    id: 'brand-awareness-survey',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Brand Awareness Survey',
    company: 'Sanofi',
    submittedBy: 'Jennifer Martinez',
    completion: 25,
    completionTotal: 50,
    launchDate: 'May 05, 2025',
    stage: 'pending',
  },
  {
    id: 'pricing-perception-study',
    iconType: 'survey',
    projectType: 'Survey',
    projectName: 'Pricing Perception Study',
    company: 'Anonymous',
    submittedBy: 'David Brown',
    completion: 18,
    completionTotal: 45,
    launchDate: 'Apr 25, 2025',
    stage: 'active',
  },
];

const PAGE_TABS: Array<{ id: LandingPageTab; label: string }> = [
  { id: 'survey-pending-queue', label: 'Survey pending queue' },
  { id: 'ihut-pending-queue', label: 'IHUT pending queue' },
  { id: 'all-projects', label: 'All projects' },
  { id: 'all-ihut', label: 'All IHUT' },
];

const STAGE_TABS: Array<{ id: ProjectStage; label: string }> = [
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'closed', label: 'Closed' },
];

const SORTABLE_COLUMNS = {
  projectName: 'projectName',
  company: 'company',
  submittedBy: 'submittedBy',
  completion: 'completion',
  launchDate: 'launchDate',
} as const;

type SortColumn = (typeof SORTABLE_COLUMNS)[keyof typeof SORTABLE_COLUMNS];

function PlusIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 2V10M2 6H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProjectTypeIcon({ iconType }: { iconType: ProjectRow['iconType'] }) {
  if (iconType === 'ihut') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2.5 3.5H8.75V9.75H2.5V3.5Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M7.25 6.25H13.5V12.5H7.25V6.25Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 1.75H9.5L12 4.25V14.25H4V1.75Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M9.5 1.75V4.25H12" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 7H10" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 9.5H10" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function parseLaunchDate(value: string) {
  return new Date(value).getTime();
}

export function ResearcherCustomerPerceptionLandingPage() {
  const [activePageTab, setActivePageTab] =
    React.useState<LandingPageTab>('all-projects');
  const [activeStageTab, setActiveStageTab] =
    React.useState<ProjectStage>('active');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProjectType, setSelectedProjectType] =
    React.useState<string>();
  const [selectedCompany, setSelectedCompany] = React.useState<string>();
  const [selectedCreator, setSelectedCreator] = React.useState<string>();
  const [sortBy, setSortBy] = React.useState<SortColumn>('completion');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'desc',
  );
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const projectTypeOptions = React.useMemo(
    () =>
      Array.from(new Set(PROJECT_ROWS.map((row) => row.projectType))).map(
        (value) => ({ id: value, label: value }),
      ),
    [],
  );

  const companyOptions = React.useMemo(
    () =>
      Array.from(new Set(PROJECT_ROWS.map((row) => row.company))).map(
        (value) => ({ id: value, label: value }),
      ),
    [],
  );

  const creatorOptions = React.useMemo(
    () =>
      Array.from(new Set(PROJECT_ROWS.map((row) => row.submittedBy))).map(
        (value) => ({ id: value, label: value }),
      ),
    [],
  );

  const tabScopedRows = React.useMemo(() => {
    if (activePageTab === 'survey-pending-queue') {
      return PROJECT_ROWS.filter(
        (row) => row.projectType === 'Survey' && row.stage === 'pending',
      );
    }

    if (activePageTab === 'ihut-pending-queue') {
      return PROJECT_ROWS.filter(
        (row) => row.projectType === 'IHUT' && row.stage === 'pending',
      );
    }

    if (activePageTab === 'all-ihut') {
      return PROJECT_ROWS.filter((row) => row.projectType === 'IHUT');
    }

    return PROJECT_ROWS;
  }, [activePageTab]);

  const filteredRows = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return tabScopedRows.filter((row) => {
      const matchesStage = row.stage === activeStageTab;
      const matchesSearch =
        !normalizedSearch ||
        row.projectName.toLowerCase().includes(normalizedSearch);
      const matchesProjectType =
        !selectedProjectType || row.projectType === selectedProjectType;
      const matchesCompany =
        !selectedCompany || row.company === selectedCompany;
      const matchesCreator =
        !selectedCreator || row.submittedBy === selectedCreator;

      return (
        matchesStage &&
        matchesSearch &&
        matchesProjectType &&
        matchesCompany &&
        matchesCreator
      );
    });
  }, [
    tabScopedRows,
    activeStageTab,
    searchTerm,
    selectedProjectType,
    selectedCompany,
    selectedCreator,
  ]);

  const sortedRows = React.useMemo(() => {
    const rows = [...filteredRows];

    rows.sort((first, second) => {
      let comparison = 0;

      switch (sortBy) {
        case 'projectName':
          comparison = first.projectName.localeCompare(second.projectName);
          break;
        case 'company':
          comparison = first.company.localeCompare(second.company);
          break;
        case 'submittedBy':
          comparison = first.submittedBy.localeCompare(second.submittedBy);
          break;
        case 'completion':
          comparison = first.completion - second.completion;
          break;
        case 'launchDate':
          comparison =
            parseLaunchDate(first.launchDate) -
            parseLaunchDate(second.launchDate);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return rows;
  }, [filteredRows, sortBy, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, pageCount);

  const pagedRows = React.useMemo(() => {
    if (sortedRows.length <= pageSize) {
      return sortedRows;
    }

    return sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize);
  }, [sortedRows, pageSize, safePage]);

  React.useEffect(() => {
    setPage(1);
  }, [
    activePageTab,
    activeStageTab,
    searchTerm,
    selectedProjectType,
    selectedCompany,
    selectedCreator,
  ]);

  React.useEffect(() => {
    setPage((previousPage) => Math.min(previousPage, pageCount));
  }, [pageCount]);

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDirection((currentDirection) =>
        currentDirection === 'asc' ? 'desc' : 'asc',
      );
      return;
    }

    setSortBy(column);
    setSortDirection('desc');
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
        minHeight: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
        }}
      >
        <PageHeader
          description="Create or review surveys and in-home usage tests for clients."
          keyCTAsButtonGroup={[
            <LDButton
              key="create-project"
              variant="primary"
              size="small"
              leading={<PlusIcon />}
            >
              Create project
            </LDButton>,
          ]}
        >
          Customer Perception
        </PageHeader>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            display: 'flex',
            borderBottom:
              '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            flexWrap: 'wrap',
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
          }}
        >
          {PAGE_TABS.map((tab) => {
            const isActive = activePageTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePageTab(tab.id)}
                style={{
                  border: 0,
                  background: 'transparent',
                  height: 48,
                  padding: '0 16px',
                  fontSize: 14,
                  lineHeight: '20px',
                  fontWeight: isActive ? 700 : 400,
                  color: 'var(--ld-semantic-color-text, #2e2f32)',
                  cursor: 'pointer',
                  borderBottom: isActive
                    ? '3px solid var(--ld-semantic-color-action-border-primary, #6245b7)'
                    : '3px solid transparent',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              width: 465,
              maxWidth: '100%',
              borderRadius: 6,
              backgroundColor:
                'var(--ld-semantic-color-background-subtle, #f8f8f8)',
              border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
              padding: 2,
              display: 'flex',
              gap: 2,
            }}
          >
            {STAGE_TABS.map((tab) => {
              const isActive = activeStageTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveStageTab(tab.id)}
                  style={{
                    flex: 1,
                    border: 0,
                    borderRadius: 4,
                    height: 28,
                    backgroundColor: isActive
                      ? 'var(--ld-semantic-color-surface, #ffffff)'
                      : 'transparent',
                    fontSize: isActive ? 12 : 14,
                    lineHeight: isActive ? '16px' : '20px',
                    fontWeight: isActive ? 700 : 400,
                    color: 'var(--ld-semantic-color-text, #2e2f32)',
                    boxShadow: isActive
                      ? '0 -1px 1px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.15)'
                      : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              borderBottom:
                '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
              overflowX: 'auto',
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <DvTable.Search
                placeholder="Search by project name"
                value={searchTerm}
                onSearch={setSearchTerm}
                debounceDelay={0}
              />
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                flexWrap: 'nowrap',
                marginLeft: 16,
                flexShrink: 0,
              }}
            >
              <MenuSingleSelect
                placeholder="Project type"
                options={projectTypeOptions}
                selectedOptionId={selectedProjectType}
                onSelect={(optionId) => {
                  setSelectedProjectType((current) =>
                    current === optionId ? undefined : optionId,
                  );
                }}
                variant="filter"
              />
              <MenuSingleSelect
                placeholder="Company"
                options={companyOptions}
                selectedOptionId={selectedCompany}
                onSelect={(optionId) => {
                  setSelectedCompany((current) =>
                    current === optionId ? undefined : optionId,
                  );
                }}
                variant="filter"
              />
              <MenuSingleSelect
                placeholder="Creator"
                options={creatorOptions}
                selectedOptionId={selectedCreator}
                onSelect={(optionId) => {
                  setSelectedCreator((current) =>
                    current === optionId ? undefined : optionId,
                  );
                }}
                variant="filter"
              />
            </div>
          </div>

          <table
            style={{ width: '100%', minWidth: 980, borderCollapse: 'collapse' }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor:
                    'var(--ld-semantic-color-background-subtle, #f8f8f8)',
                }}
              >
                <th style={{ ...thLeft, width: 52 }}>Type</th>
                <th style={{ ...thLeft, width: 220 }}>
                  <SortableHeader
                    label="Project name"
                    active={sortBy === 'projectName'}
                    onClick={() => handleSort('projectName')}
                  />
                </th>
                <th style={{ ...thLeft, width: 220 }}>
                  <SortableHeader
                    label="Company"
                    active={sortBy === 'company'}
                    onClick={() => handleSort('company')}
                  />
                </th>
                <th style={{ ...thLeft, width: 180 }}>
                  <SortableHeader
                    label="Submitted by"
                    active={sortBy === 'submittedBy'}
                    onClick={() => handleSort('submittedBy')}
                  />
                </th>
                <th style={{ ...thLeft, width: 140 }}>
                  <SortableHeader
                    label="Completion"
                    active={sortBy === 'completion'}
                    onClick={() => handleSort('completion')}
                    underlineWhenActive
                  />
                </th>
                <th style={{ ...thLeft, width: 180 }}>
                  <SortableHeader
                    label="Launch date"
                    active={sortBy === 'launchDate'}
                    onClick={() => handleSort('launchDate')}
                  />
                </th>
                <th style={{ ...thRight, width: 48 }} />
              </tr>
            </thead>

            <tbody>
              {pagedRows.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderTop:
                      '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                  }}
                >
                  <td style={{ ...tdLeft, width: 52 }}>
                    <ProjectTypeIcon iconType={row.iconType} />
                  </td>
                  <td style={{ ...tdLeft, width: 220 }}>
                    <button type="button" style={projectLinkButtonStyle}>
                      {row.projectName}
                    </button>
                  </td>
                  <td style={{ ...tdLeft, width: 220 }}>{row.company}</td>
                  <td style={{ ...tdLeft, width: 180 }}>{row.submittedBy}</td>
                  <td style={{ ...tdRight, width: 140 }}>
                    {row.completion}/{row.completionTotal}
                  </td>
                  <td style={{ ...tdLeft, width: 180 }}>{row.launchDate}</td>
                  <td style={{ ...tdRight, width: 48 }}>
                    <button
                      type="button"
                      aria-label={`More actions for ${row.projectName}`}
                      style={moreButtonStyle}
                    >
                      <LDIcon.More size="small" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              padding: 16,
              borderTop:
                '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            }}
          >
            {sortedRows.length > 10 && (
              <TablePagination
                page={safePage}
                pageCount={pageCount}
                pageSize={pageSize}
                totalItems={sortedRows.length}
                pageSizeOptions={[20]}
                onPageChange={setPage}
                onPageSizeChange={(nextPageSize) => {
                  setPageSize(nextPageSize);
                  setPage(1);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  active,
  onClick,
  underlineWhenActive = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  underlineWhenActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: 0,
        background: 'transparent',
        padding: 0,
        color: '#2e2f32',
        fontFamily: 'var(--ld-semantic-font-body-small-family)',
        fontSize: 14,
        lineHeight: '20px',
        fontWeight: 400,
        cursor: 'pointer',
      }}
    >
      <span
        style={
          underlineWhenActive && active
            ? {
                borderBottom:
                  '2px dashed var(--ld-semantic-color-separator, #909196)',
                lineHeight: '18px',
              }
            : undefined
        }
      >
        {label}
      </span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#000000',
        }}
      >
        <LDIcon.ArrowDown size="small" aria-hidden />
      </span>
    </button>
  );
}

const thLeft: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 16px',
  fontFamily: 'var(--ld-semantic-font-body-small-family)',
  fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
  lineHeight: 'var(--ld-semantic-font-body-small-lineheight, 20px)',
  fontWeight: 400,
  color: '#2e2f32',
};

const thRight: React.CSSProperties = {
  textAlign: 'right',
  padding: '10px 16px',
  fontFamily: 'var(--ld-semantic-font-body-small-family)',
  fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
  lineHeight: 'var(--ld-semantic-font-body-small-lineheight, 20px)',
  fontWeight: 400,
  color: '#2e2f32',
};

const tdLeft: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 16px',
  fontFamily: 'var(--ld-semantic-font-body-small-family)',
  fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
  lineHeight: 'var(--ld-semantic-font-body-small-lineheight, 20px)',
  color: '#2e2f32',
};

const tdRight: React.CSSProperties = {
  textAlign: 'right',
  padding: '12px 16px',
  fontFamily: 'var(--ld-semantic-font-body-small-family)',
  fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
  lineHeight: 'var(--ld-semantic-font-body-small-lineheight, 20px)',
  color: '#2e2f32',
};

const projectLinkButtonStyle: React.CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  color: 'var(--ld-semantic-color-action-text-secondary, #6245b7)',
  fontFamily: 'var(--ld-semantic-font-body-small-family)',
  fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
  lineHeight: 'var(--ld-semantic-font-body-small-lineheight, 20px)',
  textDecoration: 'underline',
  cursor: 'pointer',
  textAlign: 'left',
};

const moreButtonStyle: React.CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  color: 'var(--ld-semantic-color-text, #2e2f32)',
  cursor: 'pointer',
};
