import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from '../../../components/Button';
import {
  Button as LDButton,
  DvTable,
  DvMenuItem,
  IconButton as LDIconButton,
  LDIcon,
  MenuAction,
  MenuSingleSelect,
  PageHeader,
  useSnackbar,
} from '@walmart-dataventures/shared-components';
import { BudgetMetricInfoUnderline } from './BudgetMetricInfoUnderline';
import { TablePagination } from '../../../patterns/TablePagination/TablePagination';
import type {
  AssignedUserRow,
  AvatarTone,
  CostCenterDetailData,
  PurchaseOrderRow,
  SurveyActivityRow,
} from './types';

// ─── Mock user pool ────────────────────────────────────────────────────────
// These represent all users searchable in the system. Some IDs overlap with
// commonAssignedUsers so we can demonstrate the "already assigned" state.
const MOCK_USER_POOL: Array<{
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarTone: AvatarTone;
}> = [
  // Users that ARE in the default assigned list
  {
    id: 'usr-karen',
    name: 'Karen Smith',
    email: 'karen.smith@walmart.com',
    initials: 'K',
    avatarTone: 'blue',
  },
  {
    id: 'usr-lucas',
    name: 'Lucas Brown',
    email: 'lucas.brown@walmart.com',
    initials: 'L',
    avatarTone: 'green',
  },
  {
    id: 'usr-maria',
    name: 'Maria Garcia',
    email: 'maria.garcia@walmart.com',
    initials: 'M',
    avatarTone: 'yellow',
  },
  {
    id: 'usr-nathan',
    name: 'Nathan Lee',
    email: 'nathan.lee@walmart.com',
    initials: 'N',
    avatarTone: 'purple',
  },
  {
    id: 'usr-olivia',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@walmart.com',
    initials: 'O',
    avatarTone: 'pink',
  },
  {
    id: 'usr-peter',
    name: 'Peter Johnson',
    email: 'peter.johnson@walmart.com',
    initials: 'P',
    avatarTone: 'blue',
  },
  {
    id: 'usr-quinn',
    name: 'Quinn Taylor',
    email: 'quinn.taylor@walmart.com',
    initials: 'Q',
    avatarTone: 'green',
  },
  {
    id: 'usr-rebecca',
    name: 'Rebecca Miller',
    email: 'rebecca.miller@walmart.com',
    initials: 'R',
    avatarTone: 'yellow',
  },
  {
    id: 'usr-samuel',
    name: 'Samuel Martinez',
    email: 'samuel.martinez@walmart.com',
    initials: 'S',
    avatarTone: 'purple',
  },
  {
    id: 'usr-tina',
    name: 'Tina Anderson',
    email: 'tina.anderson@walmart.com',
    initials: 'T',
    avatarTone: 'pink',
  },
  // Additional users NOT in the default assigned list
  {
    id: 'usr-alex',
    name: 'Alex Thompson',
    email: 'alex.thompson@walmart.com',
    initials: 'A',
    avatarTone: 'blue',
  },
  {
    id: 'usr-brian',
    name: 'Brian Collins',
    email: 'brian.collins@walmart.com',
    initials: 'B',
    avatarTone: 'green',
  },
  {
    id: 'usr-chloe',
    name: 'Chloe Harrison',
    email: 'chloe.harrison@walmart.com',
    initials: 'C',
    avatarTone: 'yellow',
  },
  {
    id: 'usr-diana',
    name: 'Diana Chen',
    email: 'diana.chen@walmart.com',
    initials: 'D',
    avatarTone: 'pink',
  },
  {
    id: 'usr-evan',
    name: 'Evan Roberts',
    email: 'evan.roberts@walmart.com',
    initials: 'E',
    avatarTone: 'purple',
  },
  {
    id: 'usr-fiona',
    name: 'Fiona Wright',
    email: 'fiona.wright@walmart.com',
    initials: 'F',
    avatarTone: 'blue',
  },
  {
    id: 'usr-george',
    name: 'George Patel',
    email: 'george.patel@walmart.com',
    initials: 'G',
    avatarTone: 'green',
  },
  {
    id: 'usr-helen',
    name: 'Helen Kim',
    email: 'helen.kim@walmart.com',
    initials: 'H',
    avatarTone: 'yellow',
  },
  {
    id: 'usr-ian',
    name: 'Ian Scott',
    email: 'ian.scott@walmart.com',
    initials: 'I',
    avatarTone: 'pink',
  },
  {
    id: 'usr-jessica',
    name: 'Jessica Turner',
    email: 'jessica.turner@walmart.com',
    initials: 'J',
    avatarTone: 'purple',
  },
];

// ─── AddUserModal ────────────────────────────────────────────────────────────
function AddUserModal({
  isOpen,
  onClose,
  assignedUsers,
  onAddUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  assignedUsers: AssignedUserRow[];
  onAddUser: (user: AssignedUserRow) => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState<
    (typeof MOCK_USER_POOL)[0] | null
  >(null);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const searchWrapperRef = React.useRef<HTMLDivElement>(null);
  const inputContainerRef = React.useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const computeDropdownPos = React.useCallback(() => {
    if (!inputContainerRef.current) return;
    const rect = inputContainerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  const assignedUserIds = React.useMemo(
    () => new Set(assignedUsers.map((u) => u.id)),
    [assignedUsers],
  );

  const searchResults = React.useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return MOCK_USER_POOL.slice(0, 7);
    return MOCK_USER_POOL.filter(
      (user) =>
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized),
    ).slice(0, 8);
  }, [searchQuery]);

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Reset when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedUser(null);
      setShowDropdown(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const today = new Date();
  const lastUpdated = [
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
    today.getFullYear(),
  ].join('-');

  const canAdd = selectedUser !== null && !assignedUserIds.has(selectedUser.id);

  const handleConfirm = () => {
    if (!canAdd || !selectedUser) return;
    onAddUser({
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      initials: selectedUser.initials,
      avatarTone: selectedUser.avatarTone,
      lastUpdated,
    });
  };

  const avatarColors: Record<AvatarTone, { bg: string; color: string }> = {
    blue: { bg: '#e9f1fe', color: '#002e99' },
    green: { bg: '#e3f5e8', color: '#0d5723' },
    yellow: { bg: '#fff8e1', color: '#7a5200' },
    pink: { bg: '#fce4ec', color: '#880e3f' },
    purple: { bg: '#ede7f6', color: '#4a148c' },
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
        style={{
          backgroundColor: 'var(--ld-semantic-color-surface-overlay, white)',
          borderRadius: 16,
          width: 648,
          maxWidth: '90vw',
          boxShadow:
            '0px -1px 2px rgba(0,0,0,0.1), 0px 5px 10px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '24px 24px 16px',
          }}
        >
          <div>
            <h2
              id="add-user-title"
              style={{
                margin: '0 0 4px 0',
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'var(--ld-semantic-font-heading-medium-family)',
                lineHeight: '28px',
                color: '#2e2f32',
              }}
            >
              Add user
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontFamily: 'var(--ld-semantic-font-body-small-family)',
                lineHeight: '20px',
                color: 'var(--ld-semantic-color-text-subtle, #74767c)',
              }}
            >
              Search for a user to add them to this cost center
            </p>
          </div>
          <LDIconButton
            a11yLabel="Close dialog"
            size="medium"
            variant="secondary"
            onClick={onClose}
          >
            <LDIcon.Close size="medium" aria-hidden />
          </LDIconButton>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '0 24px 24px',
            overflow: 'visible',
          }}
        >
          {/* Search + dropdown wrapper */}
          <div ref={searchWrapperRef}>
            {/* Search input */}
            <div
              ref={inputContainerRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border:
                  '1px solid var(--ld-semantic-color-field-border, #909196)',
                borderRadius: 4,
                padding: '0 12px',
                height: 40,
                backgroundColor: 'var(--ld-semantic-color-field-fill, white)',
              }}
            >
              <LDIcon.Search
                size="small"
                aria-hidden
                style={{
                  color: 'var(--ld-semantic-color-text-subtle, #74767c)',
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                value={searchQuery}
                placeholder="Search by name or email"
                aria-label="Search users"
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  setSelectedUser(null);
                  if (value.length > 0) {
                    computeDropdownPos();
                    setShowDropdown(true);
                  } else {
                    setShowDropdown(false);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.length > 0) {
                    computeDropdownPos();
                    setShowDropdown(true);
                  }
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 14,
                  fontFamily: 'var(--ld-semantic-font-body-small-family)',
                  color: 'var(--ld-semantic-color-text, #2e2f32)',
                  backgroundColor: 'transparent',
                  lineHeight: '20px',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedUser(null);
                    setShowDropdown(false);
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: 'var(--ld-semantic-color-text-subtle, #74767c)',
                    flexShrink: 0,
                  }}
                >
                  <LDIcon.Close size="small" aria-hidden />
                </button>
              )}
            </div>

            {/* Results dropdown */}
            {showDropdown &&
              searchResults.length > 0 &&
              dropdownPos &&
              ReactDOM.createPortal(
                <div
                  style={{
                    position: 'fixed',
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width: dropdownPos.width,
                    zIndex: 9999,
                    backgroundColor: 'white',
                    borderRadius: 4,
                    boxShadow:
                      '0px -1px 2px rgba(0,0,0,0.1), 0px 5px 10px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    maxHeight: 300,
                    overflowY: 'auto',
                  }}
                >
                  {searchResults.map((user) => {
                    const isAlreadyAssigned = assignedUserIds.has(user.id);
                    const isSelected = selectedUser?.id === user.id;
                    const av = avatarColors[user.avatarTone];
                    return (
                      <div
                        key={user.id}
                        onMouseDown={(e) => {
                          // use mousedown so focus doesn't blur before click
                          e.preventDefault();
                          if (isAlreadyAssigned) return;
                          setSelectedUser(user);
                          setSearchQuery(user.name);
                          setShowDropdown(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 16px',
                          cursor: isAlreadyAssigned ? 'default' : 'pointer',
                          backgroundColor: isSelected
                            ? 'var(--ld-semantic-color-action-fill-transparent-hover, #f5f5f5)'
                            : 'transparent',
                          opacity: isAlreadyAssigned ? 0.7 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isAlreadyAssigned && !isSelected) {
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.backgroundColor = '#f5f5f5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {/* Avatar */}
                        <span
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isAlreadyAssigned
                              ? '#e3e4e5'
                              : av.bg,
                            color: isAlreadyAssigned ? '#74767c' : av.color,
                            fontSize: 12,
                            fontWeight: 700,
                            fontFamily:
                              'var(--ld-semantic-font-caption-family)',
                            flexShrink: 0,
                            border: '1px solid white',
                          }}
                        >
                          {user.initials}
                        </span>

                        {/* Name */}
                        <span
                          style={{
                            fontSize: 14,
                            color: isAlreadyAssigned ? '#74767c' : '#2e2f32',
                            fontFamily:
                              'var(--ld-semantic-font-body-small-family)',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {user.name}
                        </span>

                        {/* Email or already-assigned badge */}
                        {isAlreadyAssigned ? (
                          <span
                            style={{
                              fontSize: 12,
                              color: '#74767c',
                              fontStyle: 'italic',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Already assigned to cost center
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 14,
                              color: '#74767c',
                              fontFamily:
                                'var(--ld-semantic-font-body-small-family)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.email}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>,
                document.body,
              )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 16,
            flexShrink: 0,
          }}
        >
          <Button variant="secondary" size="medium" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="medium"
            disabled={!canAdd}
            onClick={handleConfirm}
          >
            Add user
          </Button>
        </div>
      </div>
    </div>
  );
}

type BudgetDetailPageProps = {
  data: CostCenterDetailData;
  onBackToOverview: () => void;
  onNavigateToAdmin: () => void;
  rootBreadcrumbLabel?: string | null;
  overviewBreadcrumbLabel?: string;
  companyBreadcrumbLabel?: string;
  onBackToCompanyBudgetOverview?: () => void;
  currentBreadcrumbLabel?: string;
  pageTitle?: string;
  pageDescription?: string;
  showAssignUserCTA?: boolean;
  showAssignedUserRowActions?: boolean;
  companyTag?: string;
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--ld-semantic-color-surface, #fff)',
  border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
  borderRadius: 8,
  padding: 16,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function PurchaseOrderTable({ rows }: { rows: PurchaseOrderRow[] }) {
  const totalBudget = rows.reduce((sum, row) => sum + row.budget, 0);
  const totalSpent = rows.reduce((sum, row) => sum + row.spent, 0);
  const totalCommitted = rows.reduce((sum, row) => sum + row.committed, 0);
  const totalAvailable = rows.reduce((sum, row) => sum + row.available, 0);
  const totalBilledSeparately = rows.reduce(
    (sum, row) => sum + row.billedSeparately,
    0,
  );

  type PurchaseOrderTableRow = PurchaseOrderRow & { isTotal?: boolean };

  const tableData = React.useMemo<PurchaseOrderTableRow[]>(
    () => [
      ...rows,
      {
        id: '__total__',
        name: 'Total',
        poNumber: '',
        budget: totalBudget,
        spent: totalSpent,
        committed: totalCommitted,
        available: totalAvailable,
        billedSeparately: totalBilledSeparately,
        useByDate: '',
        previousUseByDate: undefined,
        isOverspent: false,
        isTotal: true,
      },
    ],
    [
      rows,
      totalBudget,
      totalSpent,
      totalCommitted,
      totalAvailable,
      totalBilledSeparately,
    ],
  );

  const columns = React.useMemo(
    () => [
      {
        id: 'purchaseOrder',
        accessorFn: () => null,
        header: 'Purchase order',
        size: 320,
        enableSorting: false,
        cell: ({ row }: { row: { original: PurchaseOrderTableRow } }) => {
          if (row.original.isTotal) {
            return <span style={{ fontWeight: 700 }}>Total</span>;
          }

          return (
            <span>
              {row.original.name} - {row.original.poNumber}
              {row.original.isOverspent ? ' *' : ''}
            </span>
          );
        },
      },
      {
        accessorKey: 'budget',
        header: 'Budget',
        size: 120,
        enableSorting: false,
        cell: ({ row }: { row: { original: PurchaseOrderTableRow } }) => (
          <span style={row.original.isTotal ? { fontWeight: 700 } : undefined}>
            {formatCurrency(row.original.budget)}
          </span>
        ),
      },
      {
        accessorKey: 'spent',
        header: 'Spent',
        size: 120,
        enableSorting: false,
        cell: ({ row }: { row: { original: PurchaseOrderTableRow } }) => (
          <span style={row.original.isTotal ? { fontWeight: 700 } : undefined}>
            {formatCurrency(row.original.spent)}
          </span>
        ),
      },
      {
        accessorKey: 'committed',
        header: 'Committed',
        size: 120,
        enableSorting: false,
        cell: ({ row }: { row: { original: PurchaseOrderTableRow } }) => (
          <span style={row.original.isTotal ? { fontWeight: 700 } : undefined}>
            {formatCurrency(row.original.committed)}
          </span>
        ),
      },
      {
        accessorKey: 'available',
        header: 'Available',
        size: 120,
        enableSorting: false,
        cell: ({ row }: { row: { original: PurchaseOrderTableRow } }) => (
          <span style={row.original.isTotal ? { fontWeight: 700 } : undefined}>
            {formatCurrency(row.original.available)}
          </span>
        ),
      },
      {
        accessorKey: 'billedSeparately',
        header: 'Billed separately',
        size: 160,
        enableSorting: false,
        cell: ({ row }: { row: { original: PurchaseOrderTableRow } }) => (
          <span style={row.original.isTotal ? { fontWeight: 700 } : undefined}>
            {formatCurrency(row.original.billedSeparately)}
          </span>
        ),
      },
      {
        id: 'useByDate',
        accessorFn: () => null,
        header: 'Use by',
        size: 160,
        enableSorting: false,
        cell: ({ row }: { row: { original: PurchaseOrderTableRow } }) => {
          if (row.original.isTotal) {
            return null;
          }

          return (
            <div>
              <div>{row.original.useByDate}</div>
              {row.original.previousUseByDate ? (
                <div
                  style={{
                    color: 'var(--ld-semantic-color-text-subtle, #515357)',
                    fontSize: 12,
                  }}
                >
                  {row.original.previousUseByDate}
                </div>
              ) : null}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <div
        className="budget-detail-po-table-wrapper"
        style={{
          ...cardStyle,
          padding: 0,
          border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <DvTable columns={columns as any} data={tableData as any} />
        </div>
      </div>
      <div
        style={{
          paddingTop: 8,
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

function AssignedUsersSection({
  rows,
  showRowActions = true,
  onRemoveUser,
}: {
  rows: AssignedUserRow[];
  showRowActions?: boolean;
  onRemoveUser?: (userId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'desc',
  );

  const parseLastUpdated = React.useCallback((value: string) => {
    const [month, day, year] = value.split('-').map(Number);
    return new Date(year, month - 1, day).getTime();
  }, []);

  const filtered = React.useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(normalized) ||
        row.email.toLowerCase().includes(normalized),
    );
  }, [rows, searchTerm]);

  const sortedRows = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
      const first = parseLastUpdated(a.lastUpdated);
      const second = parseLastUpdated(b.lastUpdated);
      return sortDirection === 'asc' ? first - second : second - first;
    });
  }, [filtered, parseLastUpdated, sortDirection]);

  const shouldPaginate = sortedRows.length > 10;
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pagedRows = shouldPaginate
    ? sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize)
    : sortedRows;

  const handleSortToggle = () => {
    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 160,
        enableSorting: false,
        cell: ({ row }: { row: { original: AssignedUserRow } }) => (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  'var(--ld-semantic-color-fill-accent-blue-subtle, #e9f1fe)',
                color:
                  'var(--ld-semantic-color-text-onfill-accent-blue-subtle, #002e99)',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'var(--ld-semantic-font-caption-family)',
              }}
            >
              {row.original.initials}
            </span>
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email id',
        size: 320,
        enableSorting: false,
      },
      {
        id: 'lastUpdated',
        accessorKey: 'lastUpdated',
        header: () => (
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
              color: '#2e2f32',
              fontFamily: 'var(--ld-semantic-font-body-small-family)',
              fontSize: 14,
              fontWeight: 400,
              lineHeight: '20px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            aria-label={`Sort by Last updated ${
              sortDirection === 'desc' ? 'ascending' : 'descending'
            }`}
          >
            <span>Last updated</span>
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
        ),
        size: 180,
        enableSorting: false,
      },
      ...(showRowActions
        ? [
            {
              id: 'rowActions',
              accessorFn: () => null,
              header: '',
              size: 64,
              enableSorting: false,
              cell: ({ row }: { row: { original: AssignedUserRow } }) => (
                <AssignedUserRowActions
                  userName={row.original.name}
                  onRemove={() => onRemoveUser?.(row.original.id)}
                />
              ),
            },
          ]
        : []),
    ],
    [handleSortToggle, onRemoveUser, showRowActions, sortDirection],
  );

  return (
    <div style={cardStyle}>
      {/* Section header */}
      <div style={{ marginBottom: 16 }}>
        <div>
          <h3 style={sectionTitle}>Assigned users</h3>
          <p style={captionStyle}>
            Shows all the users in the company that can access this fund for
            their surveys
          </p>
        </div>
      </div>

      {/* Bordered table card */}
      <div
        className="budget-detail-assigned-users-table-wrapper"
        style={{
          ...cardStyle,
          padding: 0,
          border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <DvTable.Toolbar>
          <DvTable.Search
            placeholder="Search user by name or email id"
            value={searchTerm}
            onSearch={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            debounceDelay={0}
          />
        </DvTable.Toolbar>

        <div style={{ overflowX: 'auto' }}>
          <DvTable
            columns={columns as any}
            data={pagedRows as any}
            compact
            emptyState={{
              title: 'No users found',
              description:
                'Try adjusting your search term to find assigned users.',
            }}
            isFilterOrSearchActive={searchTerm.trim().length > 0}
          />
        </div>

        {/* Pagination footer */}
        {shouldPaginate && (
          <div
            style={{
              padding: 16,
              borderTop:
                '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            }}
          >
            <TablePagination
              page={safePage}
              pageCount={pageCount}
              pageSize={pageSize}
              totalItems={sortedRows.length}
              pageSizeOptions={[10]}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function AssignedUserRowActions({
  userName,
  onRemove,
}: {
  userName: string;
  onRemove: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  return (
    <MenuAction
      isOpen={isMenuOpen}
      onClose={() => setIsMenuOpen(false)}
      onOpen={() => setIsMenuOpen(true)}
      position="bottomLeft"
      trigger={
        <div ref={triggerRef} style={{ display: 'inline-flex' }}>
          <LDIconButton
            a11yLabel={`More options for ${userName}`}
            size="small"
            variant="secondary"
            onClick={() => setIsMenuOpen((current) => !current)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setIsMenuOpen(false);
              }
            }}
          >
            <LDIcon.More size="small" aria-hidden />
          </LDIconButton>
        </div>
      }
      triggerRef={triggerRef as React.RefObject<HTMLElement>}
    >
      <DvMenuItem
        onClick={() => {
          onRemove();
          setIsMenuOpen(false);
        }}
      >
        Remove user from the cost center
      </DvMenuItem>
    </MenuAction>
  );
}

function SurveyActivitySection({ rows }: { rows: SurveyActivityRow[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPoNumberId, setSelectedPoNumberId] = React.useState<
    string | undefined
  >();
  const [selectedCreatorId, setSelectedCreatorId] = React.useState<
    string | undefined
  >();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'desc',
  );

  const parseLastUpdated = React.useCallback((value: string) => {
    const [month, day, year] = value.split('-').map(Number);
    return new Date(year, month - 1, day).getTime();
  }, []);

  const poNumberOptions = React.useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.poNumber)))
        .sort((first, second) => first.localeCompare(second))
        .map((poNumber) => ({
          id: poNumber,
          label: poNumber,
        })),
    [rows],
  );

  const creatorOptions = React.useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.creatorName)))
        .sort((first, second) => first.localeCompare(second))
        .map((creatorName) => ({
          id: creatorName,
          label: creatorName,
        })),
    [rows],
  );

  const filtered = React.useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return rows.filter(
      (row) =>
        (!normalized ||
          row.surveyName.toLowerCase().includes(normalized) ||
          row.creatorName.toLowerCase().includes(normalized) ||
          row.poNumber.toLowerCase().includes(normalized)) &&
        (!selectedPoNumberId || row.poNumber === selectedPoNumberId) &&
        (!selectedCreatorId || row.creatorName === selectedCreatorId),
    );
  }, [rows, searchTerm, selectedPoNumberId, selectedCreatorId]);

  const sortedRows = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
      const first = parseLastUpdated(a.lastUpdated);
      const second = parseLastUpdated(b.lastUpdated);
      return sortDirection === 'asc' ? first - second : second - first;
    });
  }, [filtered, parseLastUpdated, sortDirection]);

  const shouldPaginate = sortedRows.length > 10;
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pagedRows = shouldPaginate
    ? sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize)
    : sortedRows;

  const handleSortToggle = () => {
    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  };

  const getTypeIconKind = React.useCallback((rowId: string) => {
    let hash = 0;

    for (let index = 0; index < rowId.length; index += 1) {
      hash = (hash * 31 + rowId.charCodeAt(index)) % 2147483647;
    }

    return hash % 2 === 0 ? 'article' : 'video';
  }, []);

  const columns = React.useMemo(
    () => [
      {
        id: 'type',
        accessorFn: () => null,
        header: 'Type',
        size: 80,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyActivityRow } }) =>
          getTypeIconKind(row.original.id) === 'article' ? (
            <LDIcon.Article size="small" aria-hidden />
          ) : (
            <LDIcon.Play size="small" aria-hidden />
          ),
      },
      {
        accessorKey: 'surveyName',
        header: 'Survey',
        size: 220,
        enableSorting: false,
      },
      {
        id: 'creatorName',
        accessorFn: () => null,
        header: 'Creator',
        size: 220,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyActivityRow } }) => (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '999px',
                backgroundColor:
                  'var(--ld-semantic-color-fill-accent-blue-subtle, #e9f1fe)',
                color:
                  'var(--ld-semantic-color-text-onfill-accent-blue-subtle, #002e99)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {row.original.creatorInitials}
            </span>
            {row.original.creatorName}
          </span>
        ),
      },
      {
        accessorKey: 'poNumber',
        header: 'PO number',
        size: 140,
        enableSorting: false,
      },
      {
        id: 'lastUpdated',
        accessorKey: 'lastUpdated',
        header: () => (
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
              color: '#2e2f32',
              fontFamily: 'var(--ld-semantic-font-body-small-family)',
              fontSize: 14,
              fontWeight: 400,
              lineHeight: '20px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            aria-label={`Sort by Last updated ${
              sortDirection === 'desc' ? 'ascending' : 'descending'
            }`}
          >
            <span>Last updated</span>
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
        ),
        size: 180,
        enableSorting: false,
      },
      {
        accessorKey: 'projectCost',
        header: 'Project cost',
        size: 140,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyActivityRow } }) =>
          formatCurrency(row.original.projectCost),
      },
      {
        accessorKey: 'billableCost',
        header: 'Billable cost',
        size: 140,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyActivityRow } }) =>
          formatCurrency(row.original.billableCost),
      },
      {
        accessorKey: 'discount',
        header: 'Discount',
        size: 120,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyActivityRow } }) =>
          row.original.discount === 0
            ? '--'
            : formatCurrency(row.original.discount),
      },
      {
        accessorKey: 'researchService',
        header: 'Research service',
        size: 160,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyActivityRow } }) =>
          formatCurrency(row.original.researchService),
      },
      {
        accessorKey: 'totalCost',
        header: 'Total cost',
        size: 140,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyActivityRow } }) =>
          formatCurrency(row.original.totalCost),
      },
    ],
    [getTypeIconKind, handleSortToggle, sortDirection],
  );

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={sectionTitle}>Surveys charged to the cost center</h3>
        <p style={captionStyle}>
          Shows the surveys that were charged to this cost center
        </p>
      </div>

      <div
        className="budget-detail-survey-activity-table-wrapper"
        style={{
          ...cardStyle,
          padding: 0,
          border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <DvTable.Toolbar className="survey-activity-toolbar">
          <DvTable.Search
            placeholder="Search"
            value={searchTerm}
            onSearch={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            debounceDelay={0}
          />
          <DvTable.Filters className="survey-activity-filters">
            <MenuSingleSelect
              className="budget-detail-survey-filter"
              placeholder={`Creator (${selectedCreatorId ? 1 : 0})`}
              options={creatorOptions}
              selectedOptionId={selectedCreatorId}
              onSelect={(optionId) => {
                setSelectedCreatorId((previous) =>
                  previous === optionId ? undefined : optionId,
                );
                setPage(1);
              }}
              variant="filter"
            />
            <MenuSingleSelect
              className="budget-detail-survey-filter"
              placeholder={`PO number (${selectedPoNumberId ? 1 : 0})`}
              options={poNumberOptions}
              selectedOptionId={selectedPoNumberId}
              onSelect={(optionId) => {
                setSelectedPoNumberId((previous) =>
                  previous === optionId ? undefined : optionId,
                );
                setPage(1);
              }}
              variant="filter"
            />
          </DvTable.Filters>
        </DvTable.Toolbar>

        <div style={{ overflowX: 'auto' }}>
          <DvTable
            columns={columns as any}
            data={pagedRows as any}
            compact
            frozenColumns={{ left: ['type', 'surveyName'] }}
            emptyState={{
              title: 'No surveys found',
              description:
                'Try adjusting your search term or filters to find charged surveys.',
            }}
            isFilterOrSearchActive={
              searchTerm.trim().length > 0 ||
              !!selectedPoNumberId ||
              !!selectedCreatorId
            }
          />
        </div>

        {shouldPaginate && (
          <div
            style={{
              padding: 16,
              borderTop:
                '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            }}
          >
            <TablePagination
              page={safePage}
              pageCount={pageCount}
              pageSize={pageSize}
              totalItems={sortedRows.length}
              pageSizeOptions={[10]}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  margin: '0 0 4px 0',
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

const summarySectionStyle: React.CSSProperties = {
  ...cardStyle,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
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

export function BudgetDetailPage({
  data,
  onBackToOverview,
  onNavigateToAdmin,
  rootBreadcrumbLabel = 'Admin',
  overviewBreadcrumbLabel = 'Customer Perception Budget',
  companyBreadcrumbLabel,
  onBackToCompanyBudgetOverview,
  currentBreadcrumbLabel = data.costCenterName,
  pageTitle = data.costCenterName,
  pageDescription = 'Shows the details of the cost center',
  showAssignUserCTA = true,
  showAssignedUserRowActions = true,
  companyTag,
}: BudgetDetailPageProps) {
  const { showSnackbar } = useSnackbar();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = React.useState(false);
  const [assignedUsers, setAssignedUsers] = React.useState<AssignedUserRow[]>(
    data.assignedUsers,
  );

  const getUnderlinedName = React.useCallback((value: string) => {
    return value
      .split('')
      .map((character) => `${character}\u0332`)
      .join('');
  }, []);

  const handleAddUser = React.useCallback(
    (user: AssignedUserRow) => {
      setAssignedUsers((prev) => [...prev, user]);
      setIsAddUserModalOpen(false);
      showSnackbar({
        message: `User ${getUnderlinedName(user.name)} has been added to the cost center.`,
        showCloseButton: true,
      });
    },
    [getUnderlinedName, showSnackbar],
  );

  const handleRemoveUser = React.useCallback((userId: string) => {
    setAssignedUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  const breadcrumb = [
    ...(rootBreadcrumbLabel
      ? [
          {
            label: rootBreadcrumbLabel,
            href: '#',
            onClick: (event: React.MouseEvent) => {
              event.preventDefault();
              onNavigateToAdmin();
            },
          },
        ]
      : []),
    {
      label: overviewBreadcrumbLabel,
      href: '#',
      onClick: (event: React.MouseEvent) => {
        event.preventDefault();
        onBackToOverview();
      },
    },
    ...(companyBreadcrumbLabel
      ? [
          {
            label: companyBreadcrumbLabel,
            href: '#',
            onClick: (event: React.MouseEvent) => {
              event.preventDefault();
              onBackToCompanyBudgetOverview?.();
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
        <div>
          <PageHeader
            breadcrumb={breadcrumb}
            description={pageDescription}
            keyCTAsButtonGroup={
              showAssignUserCTA
                ? [
                    <LDButton
                      key="assign-user-to-cost-center"
                      variant="primary"
                      size="small"
                      onClick={() => setIsAddUserModalOpen(true)}
                      leading={
                        <span
                          aria-hidden="true"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'currentColor',
                            fontFamily:
                              'var(--ld-semantic-font-body-small-family)',
                            fontSize: 16,
                            fontWeight: 700,
                            lineHeight: '16px',
                            width: 16,
                            height: 16,
                          }}
                        >
                          +
                        </span>
                      }
                    >
                      Assign user to cost center
                    </LDButton>,
                  ]
                : undefined
            }
            tagProps={
              companyTag
                ? [{ label: companyTag, tagVariant: 'primary', color: 'gray' }]
                : undefined
            }
          >
            {pageTitle}
          </PageHeader>
        </div>
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
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <p style={summaryLabelStyle}>Available balance</p>
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
            <DetailSummaryRow
              label="Total budget"
              value={formatCurrency(data.summary.totalBudget)}
            />
            <DetailSummaryRow
              label="Spent amount"
              value={formatCurrency(data.summary.spentAmount)}
            />
            <DetailSummaryRow
              label="Committed amount"
              value={formatCurrency(data.summary.committedAmount)}
            />
            <DetailSummaryRow
              label="Remaining balance"
              value={formatCurrency(data.summary.remainingBalance)}
            />
            <DetailSummaryRow
              label="Billed separately"
              value={formatCurrency(
                data.purchaseOrders.reduce(
                  (sum, row) => sum + row.billedSeparately,
                  0,
                ),
              )}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={sectionTitle}>Budget allocation</h3>
          <p style={captionStyle}>
            Shows how budget is allocated and utilized across purchase orders.
          </p>
          <div style={{ marginTop: 12 }}>
            <PurchaseOrderTable rows={data.purchaseOrders} />
          </div>
        </div>

        <AssignedUsersSection
          rows={assignedUsers}
          showRowActions={showAssignedUserRowActions}
          onRemoveUser={handleRemoveUser}
        />
        <AddUserModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          assignedUsers={assignedUsers}
          onAddUser={handleAddUser}
        />
        <SurveyActivitySection rows={data.recentSurveyActivity} />
      </div>
    </>
  );
}

function DetailSummaryRow({ label, value }: { label: string; value: string }) {
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
        {value}
      </div>
    </div>
  );
}
