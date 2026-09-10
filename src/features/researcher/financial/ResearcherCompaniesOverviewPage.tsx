import * as React from 'react';

import {
  DvTable,
  DvBody,
  DvHeading,
  LinkButton,
  MenuSingleSelect,
  Pagination,
  PageHeader,
} from '@walmart-dataventures/shared-components';

type PaginationItems = '5' | '10' | '15' | '20';

type ResearcherCompaniesOverviewPageProps = {
  onOpenCompanyBudget: (companyId: string, companyName: string) => void;
  onNavigateToResearcher?: () => void;
};

type CompanyBudgetRow = {
  id: string;
  company: string;
  surveysClosed: number;
  surveysInField: number;
  lastUpdated: string;
  budget: number;
  spent: number;
  available: number;
};

const COMPANY_NAMES = [
  'Acme Corp',
  'Pepsi.co',
  'Initech',
  'Umbrella Ltd',
  'Stark Industries',
  'Wayne Enterprises',
  'Oscorp',
  'Cyberdyne Systems',
  'Weyland Corp',
  'Soylent Corp',
  'Globex',
  'Hooli',
  'Massive Dynamic',
  'Wonka Industries',
  'Tyrell Corporation',
  'Virtucon',
  'Pied Piper',
  'Vandelay Industries',
  'Duff Brewing',
  'Aperture Science',
  'Initrode',
  'LexCorp',
  'Blue Sun',
  'Gringotts',
  'Roxxon Energy',
  'Monarch Solutions',
  'Nakatomi Trading',
  'Oceanic Ventures',
  'Dunder Mifflin',
  'Prestige Worldwide',
  'Paper Street',
  'Zorg Industries',
  'Abstergo',
  'Shinra Electric',
  'MomCorp',
  'Yoyodyne',
];

const LAST_UPDATED_DATES = [
  '01-08-2025',
  '02-19-2025',
  '03-12-2025',
  '03-30-2025',
  '04-15-2025',
  '04-28-2025',
  '05-02-2025',
  '05-10-2025',
  '05-20-2025',
  '06-01-2025',
];

const COMPANY_BUDGET_ROWS: CompanyBudgetRow[] = COMPANY_NAMES.map(
  (company, index) => {
    const budget = 50000 + index * 4500;
    const spent = Math.round(budget * (0.38 + (index % 6) * 0.08));

    return {
      id: company.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      company,
      surveysClosed: 4 + ((index * 3) % 48),
      surveysInField: (index * 2) % 17,
      lastUpdated: LAST_UPDATED_DATES[index % LAST_UPDATED_DATES.length],
      budget,
      spent,
      available: Math.max(0, budget - spent),
    };
  },
);

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseDate(dateString: string): Date {
  const [month, day, year] = dateString.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function matchesDateRange(dateString: string, rangeId?: string): boolean {
  if (!rangeId) return true;

  const date = parseDate(dateString);
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );
  const threeMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 3,
    now.getDate(),
  );
  const oneYearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
  );

  switch (rangeId) {
    case 'last-month':
      return date >= oneMonthAgo && date <= now;
    case 'last-3-months':
      return date >= threeMonthsAgo && date <= now;
    case 'last-year':
      return date >= oneYearAgo && date <= now;
    case 'custom':
      return true;
    default:
      return true;
  }
}

export function ResearcherCompaniesOverviewPage({
  onOpenCompanyBudget,
  onNavigateToResearcher,
}: ResearcherCompaniesOverviewPageProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>();
  const [selectedLastUpdated, setSelectedLastUpdated] =
    React.useState<string>();
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<PaginationItems>('10');
  const [sorting, setSorting] = React.useState<
    Array<{ id: string; desc: boolean }>
  >([{ id: 'lastUpdated', desc: true }]);

  const companyOptions = React.useMemo(
    () =>
      COMPANY_BUDGET_ROWS.map((row) => ({
        id: row.id,
        label: row.company,
      })),
    [],
  );

  const lastUpdatedOptions = React.useMemo(
    () => [
      { id: 'last-month', label: 'Last one month' },
      { id: 'last-3-months', label: 'Last three months' },
      { id: 'last-year', label: 'Last one year' },
      { id: 'custom', label: 'Custom date' },
    ],
    [],
  );

  const filteredRows = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return COMPANY_BUDGET_ROWS.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.company.toLowerCase().includes(normalizedSearch);
      const matchesCompany = !selectedCompanyId || row.id === selectedCompanyId;
      const matchesLastUpdated = matchesDateRange(
        row.lastUpdated,
        selectedLastUpdated,
      );

      return matchesSearch && matchesCompany && matchesLastUpdated;
    });
  }, [searchTerm, selectedCompanyId, selectedLastUpdated]);

  const sortedRows = React.useMemo(() => {
    const sortState = sorting[0];

    if (!sortState || sortState.id !== 'lastUpdated') {
      return filteredRows;
    }

    const rows = [...filteredRows].sort((firstRow, secondRow) => {
      const firstDate = parseDate(firstRow.lastUpdated).getTime();
      const secondDate = parseDate(secondRow.lastUpdated).getTime();
      return firstDate - secondDate;
    });

    return sortState.desc ? rows.reverse() : rows;
  }, [filteredRows, sorting]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'company',
        header: 'Company',
        size: 260,
        enableSorting: false,
        cell: ({ row }: { row: { original: CompanyBudgetRow } }) => (
          <LinkButton
            onClick={() =>
              onOpenCompanyBudget(row.original.id, row.original.company)
            }
            size="small"
            color="default"
            aria-label={`Open budget overview for ${row.original.company}`}
          >
            {row.original.company}
          </LinkButton>
        ),
      },
      {
        accessorKey: 'surveysClosed',
        header: ({ column }: any) => (
          <DvBody as="span" size="small">
            Survey closed
          </DvBody>
        ),
        size: 120,
        enableSorting: false,
        cell: ({ row }: { row: { original: CompanyBudgetRow } }) => (
          <DvBody as="span" size="small">
            {row.original.surveysClosed}
          </DvBody>
        ),
      },
      {
        accessorKey: 'surveysInField',
        header: ({ column }: any) => (
          <DvBody as="span" size="small">
            Surveys in field
          </DvBody>
        ),
        size: 120,
        enableSorting: false,
        cell: ({ row }: { row: { original: CompanyBudgetRow } }) => (
          <DvBody as="span" size="small">
            {row.original.surveysInField}
          </DvBody>
        ),
      },
      {
        id: 'lastUpdated',
        accessorKey: 'lastUpdated',
        header: 'Last updated',
        size: 140,
        enableSorting: true,
        sortingFn: (
          firstRow: { original: CompanyBudgetRow },
          secondRow: { original: CompanyBudgetRow },
        ) => {
          const firstDate = parseDate(firstRow.original.lastUpdated).getTime();
          const secondDate = parseDate(
            secondRow.original.lastUpdated,
          ).getTime();
          return firstDate - secondDate;
        },
      },
      {
        id: 'budget',
        accessorFn: (row: CompanyBudgetRow) => row.budget,
        header: ({ column }: any) => (
          <DvBody as="span" size="small">
            Budget
          </DvBody>
        ),
        size: 128,
        enableSorting: false,
        cell: ({ row }: { row: { original: CompanyBudgetRow } }) => (
          <DvBody as="span" size="small">
            {formatCurrency(row.original.budget)}
          </DvBody>
        ),
      },
      {
        id: 'spent',
        accessorFn: (row: CompanyBudgetRow) => row.spent,
        header: ({ column }: any) => (
          <DvBody as="span" size="small">
            Spent
          </DvBody>
        ),
        size: 128,
        enableSorting: false,
        cell: ({ row }: { row: { original: CompanyBudgetRow } }) => (
          <DvBody as="span" size="small">
            {formatCurrency(row.original.spent)}
          </DvBody>
        ),
      },
      {
        id: 'available',
        accessorFn: (row: CompanyBudgetRow) => row.available,
        header: ({ column }: any) => (
          <DvBody as="span" size="small">
            Available
          </DvBody>
        ),
        size: 128,
        enableSorting: false,
        cell: ({ row }: { row: { original: CompanyBudgetRow } }) => (
          <DvBody as="span" size="small">
            {formatCurrency(row.original.available)}
          </DvBody>
        ),
      },
    ],
    [onOpenCompanyBudget],
  );

  const pageCount = Math.max(
    1,
    Math.ceil(sortedRows.length / Number(itemsPerPage)),
  );
  const safePage = Math.min(page, pageCount);

  const pagedRows = React.useMemo(() => {
    const numericItemsPerPage = Number(itemsPerPage);

    if (sortedRows.length <= numericItemsPerPage) {
      return sortedRows;
    }

    const startIndex = (safePage - 1) * numericItemsPerPage;
    return sortedRows.slice(startIndex, startIndex + numericItemsPerPage);
  }, [sortedRows, itemsPerPage, safePage]);

  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCompanyId, selectedLastUpdated]);

  React.useEffect(() => {
    setPage((previousPage) => Math.min(previousPage, pageCount));
  }, [pageCount]);

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
              label: 'Researcher tools',
              href: '#',
              onClick: (event) => {
                event.preventDefault();
                onNavigateToResearcher?.();
              },
            },
            {
              label: 'Company budgets',
              href: '#',
              isCurrent: true,
            },
          ]}
          description="Monitor company budgets, spending, and available funds across the organizations"
        >
          Company budgets
        </PageHeader>
      </div>

      <div style={{ padding: 24 }}>
        <div
          style={{
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            padding: 16,
            width: '100%',
          }}
        >
          <DvHeading
            as="h2"
            size="small"
            weight="bold"
            style={{
              margin: 0,
            }}
          >
            Select customer account
          </DvHeading>

          <DvBody
            as="p"
            size="small"
            style={{
              margin: '4px 0 0',
              color: 'var(--ld-semantic-color-text-subtle, #515357)',
            }}
          >
            Select customer account from the list to see the details about their
            Customer Perception budget
          </DvBody>

          <div
            className="researcher-companies-table-wrapper"
            style={{
              marginTop: 16,
              border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div>
              <DvTable.Toolbar>
                <DvTable.Search
                  placeholder="Search company"
                  value={searchTerm}
                  onSearch={setSearchTerm}
                  debounceDelay={0}
                />
                <DvTable.Filters className="survey-activity-filters">
                  <MenuSingleSelect
                    className="researcher-companies-table-filter"
                    placeholder={`Company (${selectedCompanyId ? 1 : 0})`}
                    options={companyOptions}
                    selectedOptionId={selectedCompanyId}
                    onSelect={(optionId) => {
                      setSelectedCompanyId((previous) =>
                        previous === optionId ? undefined : optionId,
                      );
                    }}
                    variant="filter"
                  />
                  <MenuSingleSelect
                    className="researcher-companies-table-filter"
                    placeholder={`Last updated (${selectedLastUpdated ? 1 : 0})`}
                    options={lastUpdatedOptions}
                    selectedOptionId={selectedLastUpdated}
                    onSelect={(optionId) => {
                      setSelectedLastUpdated((previous) =>
                        previous === optionId ? undefined : optionId,
                      );
                    }}
                    variant="filter"
                  />
                </DvTable.Filters>
              </DvTable.Toolbar>
            </div>

            <div
              style={{
                overflowX: 'auto',
              }}
            >
              <DvTable
                columns={columns as any}
                data={pagedRows as any}
                compact
                enableSort
                manualSorting
                sorting={sorting}
                onSortingChange={(nextSorting) => setSorting(nextSorting)}
                emptyState={{
                  title: 'No results found',
                  description:
                    'Try adjusting your search term or filters to find company budgets.',
                }}
                isFilterOrSearchActive={
                  searchTerm.trim().length > 0 ||
                  !!selectedCompanyId ||
                  !!selectedLastUpdated
                }
              />
            </div>

            <div
              style={{
                padding: 16,
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
          </div>
        </div>
      </div>
    </>
  );
}
