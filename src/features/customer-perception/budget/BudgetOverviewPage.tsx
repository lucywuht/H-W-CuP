import * as React from 'react';

import {
  DvBody,
  DvTable,
  LDIcon,
  LinkButton,
  LuminateSelect,
  MenuSingleSelect,
  PageHeader,
} from '@walmart-dataventures/shared-components';
import { BudgetMetricInfoUnderline } from './BudgetMetricInfoUnderline';
import type {
  BudgetActivityRow,
  CostCenterBudgetRow,
  CustomerPerceptionBudgetOverviewData,
} from './types';

type BudgetOverviewPageProps = {
  data: CustomerPerceptionBudgetOverviewData;
  contractYearLabel: string;
  onChangeContractYear: (contractYearId: string) => void;
  contractYearOptions: Array<{ id: string; label: string }>;
  onOpenCostCenter: (costCenterId: string) => void;
  onNavigateToAdmin: () => void;
  rootBreadcrumbLabel?: string;
  intermediateBreadcrumbLabel?: string;
  onNavigateToIntermediate?: () => void;
  currentBreadcrumbLabel?: string;
  pageTitle?: string;
  pageDescription?: string;
  companyTag?: string;
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--ld-semantic-color-surface, #fff)',
  border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
  borderRadius: '8px',
  padding: 16,
};

const summarySectionStyle: React.CSSProperties = {
  ...cardStyle,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function AvatarGroup({
  initials,
  additionalUsers,
  allUsers,
}: {
  initials: string[];
  additionalUsers: number;
  allUsers?: boolean;
}) {
  if (allUsers) {
    return <span style={{ color: '#2e2f32' }}>All users</span>;
  }

  const tones = ['#e9f1fe', '#eaf3e6', '#fffee6', '#fce9f5', '#ece9ff'];
  const textColors = ['#002e99', '#1d5f02', '#663800', '#8c1e64', '#3c228a'];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 6,
      }}
    >
      {initials.map((value, index) => (
        <span
          key={`${value}-${index}`}
          style={{
            width: 24,
            height: 24,
            borderRadius: '999px',
            backgroundColor: tones[index % tones.length],
            color: textColors[index % textColors.length],
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {value}
        </span>
      ))}
      {additionalUsers > 0 && (
        <span
          style={{
            color: 'var(--ld-semantic-color-text-subtle, #515357)',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          +{additionalUsers}
        </span>
      )}
    </div>
  );
}

type AllocationRow = CostCenterBudgetRow & { isTotal?: boolean };

function BudgetAllocationTable({
  costCenters,
  onOpenCostCenter,
}: {
  costCenters: CostCenterBudgetRow[];
  onOpenCostCenter: (costCenterId: string) => void;
}) {
  const totalBudget = costCenters.reduce((sum, row) => sum + row.budget, 0);
  const totalSpent = costCenters.reduce((sum, row) => sum + row.spent, 0);
  const totalCommitted = costCenters.reduce(
    (sum, row) => sum + row.committed,
    0,
  );
  const totalAvailable = costCenters.reduce(
    (sum, row) => sum + row.available,
    0,
  );

  const tableData = React.useMemo<AllocationRow[]>(
    () => [
      ...costCenters,
      {
        id: '__total__',
        name: 'Total',
        budget: totalBudget,
        spent: totalSpent,
        committed: totalCommitted,
        available: totalAvailable,
        assignedUsers: [],
        additionalUsers: 0,
        billedSeparately: 0,
        isTotal: true,
      },
    ],
    [costCenters, totalBudget, totalSpent, totalCommitted, totalAvailable],
  );

  const columns = React.useMemo(
    () => [
      {
        id: 'name',
        accessorFn: () => null,
        header: () => (
          <DvBody as="span" size="small">
            Cost center
          </DvBody>
        ),
        size: 520,
        enableSorting: false,
        cell: ({ row }: { row: { original: AllocationRow } }) => {
          if (row.original.isTotal) {
            return (
              <DvBody as="span" size="small" weight="bold">
                Total
              </DvBody>
            );
          }
          if (row.original.allUsers) {
            return (
              <DvBody as="span" size="small">
                {row.original.name}
              </DvBody>
            );
          }
          return (
            <LinkButton
              onClick={() => onOpenCostCenter(row.original.id)}
              size="small"
              color="default"
              aria-label={`Open cost center ${row.original.name}`}
            >
              {row.original.name}
              {row.original.isOverspent ? ' *' : ''}
            </LinkButton>
          );
        },
      },
      {
        accessorKey: 'budget',
        header: () => (
          <DvBody as="span" size="small">
            Budget
          </DvBody>
        ),
        size: 160,
        enableSorting: false,
        cell: ({ row }: { row: { original: AllocationRow } }) => (
          <DvBody
            as="span"
            size="small"
            weight={row.original.isTotal ? 'bold' : 'default'}
          >
            {formatCurrency(row.original.budget)}
          </DvBody>
        ),
      },
      {
        accessorKey: 'spent',
        header: () => (
          <DvBody as="span" size="small">
            Spent
          </DvBody>
        ),
        size: 160,
        enableSorting: false,
        cell: ({ row }: { row: { original: AllocationRow } }) => (
          <DvBody
            as="span"
            size="small"
            weight={row.original.isTotal ? 'bold' : 'default'}
          >
            {formatCurrency(row.original.spent)}
          </DvBody>
        ),
      },
      {
        accessorKey: 'committed',
        header: () => (
          <DvBody as="span" size="small">
            Committed
          </DvBody>
        ),
        size: 160,
        enableSorting: false,
        cell: ({ row }: { row: { original: AllocationRow } }) => (
          <DvBody
            as="span"
            size="small"
            weight={row.original.isTotal ? 'bold' : 'default'}
          >
            {formatCurrency(row.original.committed)}
          </DvBody>
        ),
      },
      {
        accessorKey: 'available',
        header: () => (
          <DvBody as="span" size="small">
            Available
          </DvBody>
        ),
        size: 160,
        enableSorting: false,
        cell: ({ row }: { row: { original: AllocationRow } }) => (
          <DvBody
            as="span"
            size="small"
            weight={row.original.isTotal ? 'bold' : 'default'}
          >
            {formatCurrency(row.original.available)}
          </DvBody>
        ),
      },
      {
        accessorKey: 'assignedUsers',
        header: () => (
          <DvBody as="span" size="small">
            Assigned users
          </DvBody>
        ),
        enableSorting: false,
        cell: ({ row }: { row: { original: AllocationRow } }) => {
          if (row.original.isTotal) return null;
          return (
            <AvatarGroup
              initials={row.original.assignedUsers}
              additionalUsers={row.original.additionalUsers}
              allUsers={row.original.allUsers}
            />
          );
        },
      },
    ],
    [onOpenCostCenter],
  );

  return (
    <>
      <div
        className="budget-allocation-table-wrapper"
        style={{
          border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <DvTable columns={columns as any} data={tableData as any} compact />
      </div>
      <div
        style={{
          padding: '12px 16px',
          color: 'var(--ld-semantic-color-text-subtle, #515357)',
          fontSize: 12,
        }}
      >
        *Indicates any overspent amount that will be billed to your organization
        separately
      </div>
    </>
  );
}

function BudgetActivityTable({ rows }: { rows: BudgetActivityRow[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCostCenterId, setSelectedCostCenterId] = React.useState<
    string | undefined
  >();
  const [selectedYearId, setSelectedYearId] = React.useState<
    string | undefined
  >();
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'desc',
  );

  const parseActivityDate = React.useCallback((value: string) => {
    const [month, day, year] = value.split('-').map(Number);
    return new Date(year, month - 1, day).getTime();
  }, []);

  const handleSortToggle = React.useCallback(() => {
    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
  }, []);

  const costCenterOptions = React.useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.costCenterName))).map(
        (name) => ({
          id: name,
          label: name,
        }),
      ),
    [rows],
  );

  const yearOptions = React.useMemo(
    () =>
      Array.from(
        new Set(
          rows
            .map((row) => row.date.match(/\b(20\d{2})\b/)?.[1])
            .filter((year): year is string => !!year),
        ),
      )
        .sort((first, second) => second.localeCompare(first))
        .map((year) => ({
          id: year,
          label: year,
        })),
    [rows],
  );

  const filteredRows = React.useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return rows.filter(
      (row) =>
        (!normalized ||
          row.details.toLowerCase().includes(normalized) ||
          row.costCenterName.toLowerCase().includes(normalized)) &&
        (!selectedCostCenterId ||
          row.costCenterName === selectedCostCenterId) &&
        (!selectedYearId || row.date.includes(selectedYearId)),
    );
  }, [rows, searchTerm, selectedCostCenterId, selectedYearId]);

  const sortedRows = React.useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const first = parseActivityDate(a.date);
      const second = parseActivityDate(b.date);
      return sortDirection === 'asc' ? first - second : second - first;
    });
  }, [filteredRows, parseActivityDate, sortDirection]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'details',
        header: () => (
          <DvBody as="span" size="small">
            Details
          </DvBody>
        ),
        enableSorting: false,
        meta: {
          cellWrapStyle: 'wrap',
        },
        cell: ({ row }: { row: { original: BudgetActivityRow } }) => (
          <DvBody as="span" size="small">
            {row.original.details}
          </DvBody>
        ),
      },
      {
        id: 'costCenterName',
        accessorFn: () => null,
        header: () => (
          <DvBody as="span" size="small">
            Cost center
          </DvBody>
        ),
        size: 420,
        enableSorting: false,
        cell: ({ row }: { row: { original: BudgetActivityRow } }) => (
          <DvBody as="span" size="small" style={{ whiteSpace: 'nowrap' }}>
            {row.original.costCenterName}
          </DvBody>
        ),
      },
      {
        accessorKey: 'amount',
        header: () => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <DvBody as="span" size="small">
              Amount
            </DvBody>
          </div>
        ),
        size: 180,
        enableSorting: false,
        meta: {
          textAlign: 'right',
          skipDivWrapper: true,
        },
        cell: ({ row }: { row: { original: BudgetActivityRow } }) => (
          <DvBody as="span" size="small">
            + {formatCurrency(row.original.amount)}
          </DvBody>
        ),
      },
      {
        accessorKey: 'date',
        size: 180,
        header: () => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <button
              type="button"
              onClick={handleSortToggle}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: 0,
                background: 'transparent',
                padding: '2px 0',
                cursor: 'pointer',
                whiteSpace: 'nowrap' as const,
              }}
              aria-label={`Sort by Date ${
                sortDirection === 'desc' ? 'ascending' : 'descending'
              }`}
            >
              <DvBody as="span" size="small">
                Date
              </DvBody>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 4px',
                  color: '#000000',
                  lineHeight: 1,
                }}
              >
                {sortDirection === 'asc' ? (
                  <LDIcon.ArrowUp
                    size="small"
                    aria-hidden
                    style={{ color: '#000000' }}
                  />
                ) : (
                  <LDIcon.ArrowDown
                    size="small"
                    aria-hidden
                    style={{ color: '#000000' }}
                  />
                )}
              </span>
            </button>
          </div>
        ),
        enableSorting: false,
        meta: {
          textAlign: 'right',
          skipDivWrapper: true,
        },
        cell: ({ row }: { row: { original: BudgetActivityRow } }) => (
          <DvBody as="span" size="small">
            {row.original.date}
          </DvBody>
        ),
      },
    ],
    [handleSortToggle, sortDirection],
  );

  return (
    <div style={{ ...cardStyle, border: 'none' }}>
      <h3 style={sectionTitle}>Budget activity</h3>
      <div
        className="budget-activity-table-wrapper"
        style={{
          border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div>
          <DvTable.Toolbar className="budget-activity-toolbar">
            <DvTable.Search
              placeholder="Search"
              value={searchTerm}
              onSearch={setSearchTerm}
              debounceDelay={0}
            />
            <DvTable.Filters className="budget-activity-toolbar-filters">
              <MenuSingleSelect
                className="budget-activity-filter"
                placeholder={`Cost center (${selectedCostCenterId ? 1 : 0})`}
                options={costCenterOptions}
                selectedOptionId={selectedCostCenterId}
                onSelect={(optionId) =>
                  setSelectedCostCenterId((previous) =>
                    previous === optionId ? undefined : optionId,
                  )
                }
                variant="filter"
              />
              <MenuSingleSelect
                className="budget-activity-filter"
                placeholder={`Year (${selectedYearId ? 1 : 0})`}
                options={yearOptions}
                selectedOptionId={selectedYearId}
                onSelect={(optionId) =>
                  setSelectedYearId((previous) =>
                    previous === optionId ? undefined : optionId,
                  )
                }
                variant="filter"
              />
            </DvTable.Filters>
          </DvTable.Toolbar>
        </div>
        <DvTable columns={columns as any} data={sortedRows as any} compact />
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  margin: '0 0 8px 0',
  fontFamily: 'var(--ld-semantic-font-body-medium-family)',
  fontSize: 'var(--ld-semantic-font-body-medium-size, 16px)',
  lineHeight: 'var(--ld-semantic-font-body-medium-lineheight, 24px)',
  fontWeight: 'var(--ld-semantic-font-body-medium-weight-alt, 700)',
  color: 'var(--ld-semantic-color-text, #2e2f32)',
};

const captionStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--ld-semantic-font-body-small-family)',
  fontSize: 'var(--ld-semantic-font-body-small-size, 12px)',
  lineHeight: 'var(--ld-semantic-font-body-small-lineheight, 16px)',
  fontWeight: 'var(--ld-semantic-font-body-small-weight, 400)',
  color: 'var(--ld-semantic-color-text-subtle, #515357)',
};

const thLeft: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 16px',
  fontSize: 14,
  fontWeight: 400,
  color: '#2e2f32',
};

const thRight: React.CSSProperties = {
  textAlign: 'right',
  padding: '10px 16px',
  fontSize: 14,
  fontWeight: 400,
  color: '#2e2f32',
};

const tdLeft: React.CSSProperties = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: 14,
  color: '#2e2f32',
  verticalAlign: 'middle',
};

const tdRight: React.CSSProperties = {
  textAlign: 'right',
  padding: '14px 16px',
  fontSize: 14,
  color: '#2e2f32',
  verticalAlign: 'middle',
  fontFamily: 'var(--ld-semantic-font-body-mono-small-family, monospace)',
};

const summaryLabelStyle: React.CSSProperties = {
  margin: 0,
  color: '#2e2f32',
  fontFamily: 'var(--ld-semantic-font-body-small-family)',
  fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
  lineHeight: 'var(--ld-semantic-font-body-small-lineheight, 20px)',
  fontWeight: 'var(--ld-semantic-font-body-small-weight, 400)',
};

const summaryValueStyle: React.CSSProperties = {
  margin: 0,
  color: '#2e2f32',
  fontFamily: 'var(--ld-semantic-font-heading-medium-family, EverydaySans)',
  fontSize: 'var(--ld-semantic-font-heading-medium-size, 20px)',
  lineHeight: 'var(--ld-semantic-font-heading-medium-lineheight, 28px)',
  fontWeight: 'var(--ld-semantic-font-heading-medium-weight-default, 700)',
};

export function BudgetOverviewPage({
  data,
  contractYearLabel,
  onChangeContractYear,
  contractYearOptions,
  onOpenCostCenter,
  onNavigateToAdmin,
  rootBreadcrumbLabel = 'Admin',
  intermediateBreadcrumbLabel,
  onNavigateToIntermediate,
  currentBreadcrumbLabel = 'Customer Perception Budget',
  pageTitle = 'Customer Perception Budget',
  pageDescription = 'Manage budgets that can be used to submit surveys',
  companyTag,
}: BudgetOverviewPageProps) {
  const breadcrumb = [
    {
      label: rootBreadcrumbLabel,
      href: '#',
      onClick: (event: React.MouseEvent) => {
        event.preventDefault();
        onNavigateToAdmin();
      },
    },
    ...(intermediateBreadcrumbLabel
      ? [
          {
            label: intermediateBreadcrumbLabel,
            href: '#',
            onClick: (event: React.MouseEvent) => {
              event.preventDefault();
              onNavigateToIntermediate?.();
            },
          },
        ]
      : []),
    {
      label: currentBreadcrumbLabel,
      href: '#',
      isCurrent: true,
    },
  ];

  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
        }}
      >
        <PageHeader
          breadcrumb={breadcrumb}
          description={pageDescription}
          tagProps={
            companyTag
              ? [{ label: companyTag, tagVariant: 'primary', color: 'gray' }]
              : undefined
          }
        >
          {pageTitle}
        </PageHeader>
      </div>

      <div
        style={{
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div style={summarySectionStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                flex: '1 1 360px',
                minWidth: 0,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={summaryLabelStyle}>Total company available balance</p>
                <p style={summaryValueStyle}>
                  {formatCurrency(data.summary.availableBalance)}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <SummaryRow
                  label="Total budget"
                  value={data.summary.totalBudget}
                />
                <SummaryRow
                  label="Spent amount"
                  value={data.summary.spentAmount}
                />
                <SummaryRow
                  label="Committed amount"
                  value={data.summary.committedAmount}
                />
                <SummaryRow
                  label="Remaining balance"
                  value={data.summary.remainingBalance}
                />
              </div>
            </div>

            <div style={{ width: 240, maxWidth: '100%' }}>
              <LuminateSelect
                label="Filter by contract year"
                options={contractYearOptions.map((option) => ({
                  key: option.id,
                  label: option.label,
                }))}
                value={data.contractYearId}
                onChange={onChangeContractYear}
                isFullWidth
                scrollableDivId="contractYearMenuList"
              />
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, border: 'none' }}>
          <h3 style={sectionTitle}>Budget allocation</h3>
          <p style={captionStyle}>
            Shows how budget is allocated and utilized across cost centers
          </p>
          <div style={{ marginTop: 12 }}>
            <BudgetAllocationTable
              costCenters={data.costCenters}
              onOpenCostCenter={onOpenCostCenter}
            />
          </div>
        </div>

        <BudgetActivityTable rows={data.activity} />
      </div>
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 4,
        minWidth: 120,
      }}
    >
      <BudgetMetricInfoUnderline label={label} />
      <div
        style={{
          color: '#2e2f32',
          fontFamily: 'var(--ld-semantic-font-body-medium-family)',
          fontSize: 'var(--ld-semantic-font-body-medium-size, 16px)',
          lineHeight: 'var(--ld-semantic-font-body-medium-lineheight, 24px)',
          fontWeight: 'var(--ld-semantic-font-body-medium-weight-alt, 700)',
        }}
      >
        {formatCurrency(value)}
      </div>
    </div>
  );
}
