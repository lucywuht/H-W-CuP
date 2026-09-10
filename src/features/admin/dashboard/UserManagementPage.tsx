import * as React from 'react';

import {
  Button as LDButton,
  DvBody,
  DvTable,
  DvMenuItem,
  IconButton as LDIconButton,
  LDIcon,
  LinkButton,
  MenuAction,
  MenuSingleSelect,
  Pagination,
  PageHeader,
  Tag,
  useSnackbar,
} from '@walmart-dataventures/shared-components';

import {
  USER_MANAGEMENT_ROWS,
  type UserManagementRow,
  type UserManagementTab,
} from './userManagementData';

function UserManagementRowActions({
  name,
  onRemove,
}: {
  name: string;
  onRemove: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <MenuAction
      isOpen={isMenuOpen}
      onClose={() => setIsMenuOpen(false)}
      onOpen={() => setIsMenuOpen(true)}
      position="bottomRight"
      trigger={
        <LDIconButton
          ref={triggerRef}
          a11yLabel={`More options for ${name}`}
          size="small"
          variant="secondary"
        >
          <LDIcon.More size="small" aria-hidden />
        </LDIconButton>
      }
      triggerRef={triggerRef as React.RefObject<HTMLElement>}
    >
      <DvMenuItem
        onClick={() => {
          onRemove();
          setIsMenuOpen(false);
        }}
      >
        Remove user
      </DvMenuItem>
    </MenuAction>
  );
}

type UserManagementPageProps = {
  onNavigateToAdmin: () => void;
  onNavigateToAddSingleUser: () => void;
  onOpenUserDetails: (
    userId: string,
    userName: string,
    userEmail: string,
  ) => void;
  addedUserName?: string | null;
  onAddedUserNoticeShown?: () => void;
};

type PaginationItems = '5' | '10' | '15' | '20';

export function UserManagementPage({
  onNavigateToAdmin,
  onNavigateToAddSingleUser,
  onOpenUserDetails,
  addedUserName,
  onAddedUserNoticeShown,
}: UserManagementPageProps) {
  const { showSnackbar } = useSnackbar();
  const [rows, setRows] = React.useState(USER_MANAGEMENT_ROWS);
  const [isAddUsersMenuOpen, setIsAddUsersMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<UserManagementTab>('active');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedUserType, setSelectedUserType] = React.useState<string>();
  const [selectedAccessType, setSelectedAccessType] = React.useState<string>();
  const [selectedAppAccess, setSelectedAppAccess] = React.useState<string>();
  const [sortBy, setSortBy] = React.useState<'name' | 'lastLogin'>('lastLogin');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'desc',
  );
  const [expandedAppAccessRows, setExpandedAppAccessRows] = React.useState<
    Record<string, boolean>
  >({});
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<PaginationItems>('10');
  const addUsersTriggerRef = React.useRef<HTMLDivElement>(null);

  const getUnderlinedName = React.useCallback((value: string) => {
    return value
      .split('')
      .map((character) => `${character}\u0332`)
      .join('');
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [
    activeTab,
    searchTerm,
    selectedUserType,
    selectedAccessType,
    selectedAppAccess,
  ]);

  React.useEffect(() => {
    if (!addedUserName) {
      return;
    }

    showSnackbar({
      message: `User ${getUnderlinedName(addedUserName)} profile has been updated.`,
      showCloseButton: true,
    });
    onAddedUserNoticeShown?.();
  }, [addedUserName, getUnderlinedName, onAddedUserNoticeShown, showSnackbar]);

  const tabRows = React.useMemo(
    () => rows.filter((row) => row.tab === activeTab),
    [rows, activeTab],
  );

  const userTypeOptions = React.useMemo(
    () =>
      Array.from(new Set(tabRows.map((row) => row.userType))).map((value) => ({
        id: value,
        label: value,
      })),
    [tabRows],
  );

  const accessTypeOptions = React.useMemo(
    () =>
      Array.from(new Set(tabRows.map((row) => row.accessType))).map(
        (value) => ({
          id: value,
          label: value,
        }),
      ),
    [tabRows],
  );

  const appAccessOptions = React.useMemo(
    () =>
      Array.from(new Set(tabRows.flatMap((row) => row.appAccessTags))).map(
        (value) => ({
          id: value,
          label: value,
        }),
      ),
    [tabRows],
  );

  const filteredRows = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return tabRows.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.name.toLowerCase().includes(normalizedSearch) ||
        row.email.toLowerCase().includes(normalizedSearch);

      const matchesUserType =
        !selectedUserType || row.userType === selectedUserType;
      const matchesAccessType =
        !selectedAccessType || row.accessType === selectedAccessType;
      const matchesAppAccess =
        !selectedAppAccess || row.appAccessTags.includes(selectedAppAccess);

      return (
        matchesSearch &&
        matchesUserType &&
        matchesAccessType &&
        matchesAppAccess
      );
    });
  }, [
    tabRows,
    searchTerm,
    selectedUserType,
    selectedAccessType,
    selectedAppAccess,
  ]);

  const sortedRows = React.useMemo(() => {
    const sorted = [...filteredRows];

    sorted.sort((first, second) => {
      if (sortBy === 'name') {
        const comparison = first.name.localeCompare(second.name);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      const comparison = first.lastLoginAt - second.lastLoginAt;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredRows, sortBy, sortDirection]);

  const pageSize = Number(itemsPerPage);
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pagedRows =
    sortedRows.length > pageSize
      ? sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize)
      : sortedRows;

  const handleSortName = () => {
    if (sortBy === 'name') {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy('name');
    setSortDirection('asc');
  };

  const handleSortLastLogin = () => {
    if (sortBy === 'lastLogin') {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy('lastLogin');
    setSortDirection('desc');
  };

  const toggleAppAccessRow = React.useCallback((rowId: string) => {
    setExpandedAppAccessRows((current) => ({
      ...current,
      [rowId]: !current[rowId],
    }));
  }, []);

  const columns = React.useMemo(
    () => [
      {
        id: 'select',
        accessorFn: (): null => null,
        header: () => (
          <span>
            <input type="checkbox" aria-label="Select all users" />
          </span>
        ),
        size: 48,
        minSize: 48,
        maxSize: 48,
        enableSorting: false,
        cell: ({ row }: { row: { original: UserManagementRow } }) => (
          <span>
            <input type="checkbox" aria-label={`Select ${row.original.name}`} />
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: () => (
          <button
            type="button"
            onClick={handleSortName}
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
            }}
            aria-label={`Sort by name ${
              sortBy === 'name' && sortDirection === 'asc'
                ? 'descending'
                : 'ascending'
            }`}
          >
            <span>Name</span>
            <span aria-hidden style={{ fontSize: 13, lineHeight: 1 }}>
              ↕
            </span>
          </button>
        ),
        size: 240,
        enableSorting: false,
        cell: ({ row }: { row: { original: UserManagementRow } }) => (
          <>
            <LinkButton
              onClick={() =>
                onOpenUserDetails(
                  row.original.id,
                  row.original.name,
                  row.original.email,
                )
              }
              size="small"
              color="default"
              aria-label={`Open user details for ${row.original.name}`}
            >
              {row.original.name}
            </LinkButton>
            <div
              style={{
                color: 'var(--ld-semantic-color-text-subtle, #515357)',
                fontSize: 14,
                lineHeight: '20px',
              }}
            >
              {row.original.email}
            </div>
          </>
        ),
      },
      {
        accessorKey: 'userType',
        header: 'User type',
        size: 136,
        enableSorting: false,
        cell: ({ row }: { row: { original: UserManagementRow } }) => (
          <DvBody as="span" size="small">
            {row.original.userType}
          </DvBody>
        ),
      },
      {
        accessorKey: 'accessType',
        header: 'Access type',
        size: 160,
        enableSorting: false,
        cell: ({ row }: { row: { original: UserManagementRow } }) => (
          <DvBody as="span" size="small">
            {row.original.accessType}
          </DvBody>
        ),
      },
      {
        id: 'appAccess',
        accessorFn: (row: UserManagementRow) => row.appAccessTags,
        header: 'App access',
        size: 640,
        minSize: 640,
        enableSorting: false,
        meta: {
          skipDivWrapper: true,
          cellWrapStyle: 'nowrap' as const,
        },
        cell: ({ row }: { row: { original: UserManagementRow } }) => {
          const maxVisibleTags = 3;
          const isExpanded = Boolean(expandedAppAccessRows[row.original.id]);
          const hiddenTagCount = Math.max(
            row.original.appAccessTags.length - maxVisibleTags,
            0,
          );
          const visibleTags = isExpanded
            ? row.original.appAccessTags
            : row.original.appAccessTags.slice(0, maxVisibleTags);

          return (
            <div
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: 8,
                alignItems: 'center',
              }}
            >
              {visibleTags.map((tagLabel) => (
                <Tag
                  key={`${row.original.id}-${tagLabel}`}
                  color="gray"
                  size="small"
                  variant="tertiary"
                >
                  {tagLabel}
                </Tag>
              ))}
              {hiddenTagCount > 0 && (
                <LinkButton
                  onClick={() => toggleAppAccessRow(row.original.id)}
                  size="small"
                  color="default"
                  aria-label={`${
                    isExpanded ? 'See less' : 'See more'
                  } app access tags for ${row.original.name}`}
                >
                  {isExpanded ? 'See less' : 'See more'}
                </LinkButton>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'lastLogin',
        header: () => (
          <button
            type="button"
            onClick={handleSortLastLogin}
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
            }}
            aria-label={`Sort by last login ${
              sortBy === 'lastLogin' && sortDirection === 'desc'
                ? 'ascending'
                : 'descending'
            }`}
          >
            <span>Last login</span>
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {sortBy === 'lastLogin' && sortDirection === 'asc' ? (
                <LDIcon.ArrowUp size="small" aria-hidden />
              ) : (
                <LDIcon.ArrowDown size="small" aria-hidden />
              )}
            </span>
          </button>
        ),
        size: 160,
        enableSorting: false,
      },
      {
        id: 'actions',
        accessorFn: (): null => null,
        header: '',
        size: 44,
        minSize: 44,
        maxSize: 44,
        enableSorting: false,
        meta: { textAlign: 'right' as const },
        cell: ({ row }: { row: { original: UserManagementRow } }) => (
          <UserManagementRowActions
            name={row.original.name}
            onRemove={() =>
              setRows((current) =>
                current.filter((item) => item.id !== row.original.id),
              )
            }
          />
        ),
      },
    ],
    [
      handleSortLastLogin,
      handleSortName,
      onOpenUserDetails,
      expandedAppAccessRows,
      sortBy,
      sortDirection,
      toggleAppAccessRow,
    ],
  );

  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
        }}
      >
        <PageHeader
          breadcrumb={[
            {
              label: 'Admin',
              href: '#',
              onClick: (event) => {
                event.preventDefault();
                onNavigateToAdmin();
              },
            },
            {
              label: 'User Management',
              href: '#',
              isCurrent: true,
            },
          ]}
          description="Manage individual or role-based access to Scintilla features and data"
          keyCTAsButtonGroup={[
            <LDButton key="access-requests" variant="secondary" size="medium">
              Access requests (4)
            </LDButton>,
            <MenuAction
              key="add-users"
              isOpen={isAddUsersMenuOpen}
              onClose={() => setIsAddUsersMenuOpen(false)}
              onOpen={() => setIsAddUsersMenuOpen(true)}
              position="bottomRight"
              trigger={
                <div
                  ref={addUsersTriggerRef}
                  style={{ display: 'inline-flex' }}
                >
                  <LDButton
                    variant="primary"
                    size="medium"
                    onClick={() => setIsAddUsersMenuOpen((current) => !current)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        setIsAddUsersMenuOpen(false);
                      }
                    }}
                    trailing={<LDIcon.ChevronDown size="small" aria-hidden />}
                  >
                    Add users
                  </LDButton>
                </div>
              }
              triggerRef={addUsersTriggerRef as React.RefObject<HTMLElement>}
            >
              <DvMenuItem
                onClick={() => {
                  setIsAddUsersMenuOpen(false);
                  onNavigateToAddSingleUser();
                }}
              >
                Single user
              </DvMenuItem>
              <DvMenuItem onClick={() => setIsAddUsersMenuOpen(false)}>
                Multiple using file upload
              </DvMenuItem>
            </MenuAction>,
            <LDIconButton
              key="more-actions"
              a11yLabel="More user management actions"
              size="medium"
              variant="secondary"
            >
              <LDIcon.More size="small" aria-hidden />
            </LDIconButton>,
          ]}
        >
          User Management
        </PageHeader>
      </div>

      <div
        style={{
          backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
          borderBottom: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
          paddingLeft: 24,
        }}
      >
        {(
          [
            { id: 'active' as const, label: 'Active' },
            { id: 'pending' as const, label: 'Pending' },
            { id: 'blocked' as const, label: 'Blocked' },
          ] satisfies Array<{ id: UserManagementTab; label: string }>
        ).map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                border: 0,
                borderBottom: isActive
                  ? '3px solid var(--ld-semantic-color-action-border-primary, #6245b7)'
                  : '3px solid transparent',
                background: 'transparent',
                height: 48,
                padding: '0 12px',
                marginRight: 4,
                fontSize: 14,
                lineHeight: '20px',
                fontWeight: isActive ? 700 : 400,
                color: 'var(--ld-semantic-color-text, #2e2f32)',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 24 }}>
        <div
          style={{
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
            }}
          >
            <DvTable.Toolbar className="user-management-table-toolbar">
              <DvTable.Search
                className="user-management-table-search"
                placeholder="Search by user name or email"
                value={searchTerm}
                onSearch={setSearchTerm}
                debounceDelay={0}
              />
              <DvTable.Filters className="user-management-table-filters">
                <MenuSingleSelect
                  className="user-management-table-filter"
                  placeholder={`User type(${selectedUserType ? 1 : 0})`}
                  options={userTypeOptions}
                  selectedOptionId={selectedUserType}
                  onSelect={(optionId) => {
                    setSelectedUserType((previous) =>
                      previous === optionId ? undefined : optionId,
                    );
                  }}
                  variant="filter"
                />
                <MenuSingleSelect
                  className="user-management-table-filter"
                  placeholder={`Access type (${selectedAccessType ? 1 : 0})`}
                  options={accessTypeOptions}
                  selectedOptionId={selectedAccessType}
                  onSelect={(optionId) => {
                    setSelectedAccessType((previous) =>
                      previous === optionId ? undefined : optionId,
                    );
                  }}
                  variant="filter"
                />
                <MenuSingleSelect
                  className="user-management-table-filter"
                  placeholder={`App access(${selectedAppAccess ? 1 : 0})`}
                  options={appAccessOptions}
                  selectedOptionId={selectedAppAccess}
                  onSelect={(optionId) => {
                    setSelectedAppAccess((previous) =>
                      previous === optionId ? undefined : optionId,
                    );
                  }}
                  variant="filter"
                />
              </DvTable.Filters>
            </DvTable.Toolbar>
          </div>

          <div
            className="user-management-table-wrapper"
            style={{ overflowX: 'auto' }}
          >
            <DvTable columns={columns as any} data={pagedRows as any} compact />
          </div>

          {sortedRows.length > pageSize && (
            <div
              style={{
                padding: 16,
                borderTop:
                  '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
              }}
            >
              <Pagination
                currentPage={safePage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(value) => {
                  setItemsPerPage(value);
                  setPage(1);
                }}
                setCurrentPage={(value) => {
                  const parsedValue = Number(value);
                  if (!Number.isNaN(parsedValue)) {
                    setPage(parsedValue);
                  }
                }}
                totalItemCount={sortedRows.length}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
