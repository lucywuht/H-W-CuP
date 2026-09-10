import * as React from 'react';

import {
  Alert,
  Button,
  Divider,
  DvTable,
  IconButton as LDIconButton,
  LDIcon,
  LinkButton,
  MenuSingleSelect,
  Modal,
  Pagination,
  PageHeader,
  Select,
  TextArea,
  TextField,
} from '@walmart-dataventures/shared-components';
import { SHARED_PURCHASE_ORDER_OPTIONS } from '../../customer-perception/shared/purchaseOrderOptions';
import { Checkbox } from '../../../components/Checkbox';
import { useSnackbar } from '../../../components/Snackbar';
import { VisuallyHidden } from '../../../components/VisuallyHidden';

type SurveyBillingPageProps = {
  onNavigateToResearcher?: () => void;
};

type SurveyBillingRow = {
  id: string;
  type: 'article' | 'video';
  survey: string;
  company: string;
  creatorName: string;
  creatorInitial: string;
  costCenter: string;
  poNumber: string;
  closedDate: string;
  status: 'Invoiced' | 'Pending invoice';
  lastUpdate: string;
  projectCost: number;
  billableCost: number;
  discount: number | null;
  researchService: number;
  totalCost: number;
};

type PaginationItems = '5' | '10' | '15' | '20';

type BillingModalState = {
  billableCompletes: string;
  billableEnrichment: string;
  billableCpc: string;
  billableTotal: string;
  researchServicesCost: string;
  otherDiscounts: string;
  totalProjectCost: string;
  costCenter: string;
  purchaseOrderCode: string;
  note: string;
};

type BillingPurchaseOrderOption = {
  key: string;
  label: string;
  costCenter: string;
  availableBalance: number;
  validThrough: string;
};

const SURVEY_BILLING_ROWS: SurveyBillingRow[] = [
  {
    id: 'row-1',
    type: 'article',
    survey: 'Brand tracking pulse',
    company: 'Sanofi',
    creatorName: 'John Doe',
    creatorInitial: 'J',
    costCenter: '1234567890',
    poNumber: '234567',
    closedDate: '04-10-2025',
    status: 'Invoiced',
    lastUpdate: '05-10-2025',
    projectCost: 62200,
    billableCost: 2200,
    discount: null,
    researchService: 1000,
    totalCost: 65200,
  },
  {
    id: 'row-2',
    type: 'video',
    survey: 'NPS quarterly wave',
    company: 'PepsiCo',
    creatorName: 'Ava Brown',
    creatorInitial: 'A',
    costCenter: '1298765432',
    poNumber: '234568',
    closedDate: '06-10-2025',
    status: 'Invoiced',
    lastUpdate: '07-10-2025',
    projectCost: 41200,
    billableCost: 4200,
    discount: 500,
    researchService: 2200,
    totalCost: 46900,
  },
  {
    id: 'row-3',
    type: 'article',
    survey: 'Ad concept screener',
    company: 'Initech',
    creatorName: 'Leo Carter',
    creatorInitial: 'L',
    costCenter: '1200345678',
    poNumber: '234569',
    closedDate: '07-10-2025',
    status: 'Pending invoice',
    lastUpdate: '08-10-2025',
    projectCost: 28000,
    billableCost: 1900,
    discount: null,
    researchService: 1450,
    totalCost: 31350,
  },
  {
    id: 'row-4',
    type: 'video',
    survey: 'Price perception tracker',
    company: 'Umbrella Ltd',
    creatorName: 'Nina Lee',
    creatorInitial: 'N',
    costCenter: '1111456789',
    poNumber: '234570',
    closedDate: '09-10-2025',
    status: 'Invoiced',
    lastUpdate: '10-10-2025',
    projectCost: 35800,
    billableCost: 2800,
    discount: 700,
    researchService: 1800,
    totalCost: 39700,
  },
  {
    id: 'row-5',
    type: 'article',
    survey: 'Shopper mission deep dive',
    company: 'Stark Industries',
    creatorName: 'Owen Diaz',
    creatorInitial: 'O',
    costCenter: '1222456789',
    poNumber: '234571',
    closedDate: '10-10-2025',
    status: 'Pending invoice',
    lastUpdate: '11-10-2025',
    projectCost: 51200,
    billableCost: 6200,
    discount: 1000,
    researchService: 2400,
    totalCost: 58800,
  },
  {
    id: 'row-6',
    type: 'video',
    survey: 'Creative pre-test',
    company: 'Wayne Enterprises',
    creatorName: 'Priya Shah',
    creatorInitial: 'P',
    costCenter: '1333456789',
    poNumber: '234572',
    closedDate: '11-10-2025',
    status: 'Invoiced',
    lastUpdate: '12-10-2025',
    projectCost: 29800,
    billableCost: 2600,
    discount: null,
    researchService: 1600,
    totalCost: 34000,
  },
  {
    id: 'row-7',
    type: 'article',
    survey: 'Usage & attitudes',
    company: 'Globex',
    creatorName: 'Mila Chen',
    creatorInitial: 'M',
    costCenter: '1444456789',
    poNumber: '234573',
    closedDate: '12-10-2025',
    status: 'Pending invoice',
    lastUpdate: '13-10-2025',
    projectCost: 33400,
    billableCost: 3000,
    discount: 400,
    researchService: 1500,
    totalCost: 37500,
  },
  {
    id: 'row-8',
    type: 'video',
    survey: 'Category diagnostics',
    company: 'Hooli',
    creatorName: 'Rita Evans',
    creatorInitial: 'R',
    costCenter: '1555456789',
    poNumber: '234574',
    closedDate: '13-10-2025',
    status: 'Invoiced',
    lastUpdate: '14-10-2025',
    projectCost: 38600,
    billableCost: 3200,
    discount: null,
    researchService: 1700,
    totalCost: 43500,
  },
  {
    id: 'row-9',
    type: 'article',
    survey: 'Concept refinement',
    company: 'Massive Dynamic',
    creatorName: 'Sam Blake',
    creatorInitial: 'S',
    costCenter: '1666456789',
    poNumber: '234575',
    closedDate: '14-10-2025',
    status: 'Invoiced',
    lastUpdate: '15-10-2025',
    projectCost: 24700,
    billableCost: 1800,
    discount: 200,
    researchService: 1200,
    totalCost: 27500,
  },
  {
    id: 'row-10',
    type: 'video',
    survey: 'Path-to-purchase study',
    company: 'Cyberdyne Systems',
    creatorName: 'Ivy Turner',
    creatorInitial: 'I',
    costCenter: '1777456789',
    poNumber: '234576',
    closedDate: '15-10-2025',
    status: 'Pending invoice',
    lastUpdate: '16-10-2025',
    projectCost: 43800,
    billableCost: 4600,
    discount: 500,
    researchService: 2100,
    totalCost: 50000,
  },
  {
    id: 'row-11',
    type: 'article',
    survey: 'Awareness benchmark',
    company: 'Dunder Mifflin',
    creatorName: 'Noah Green',
    creatorInitial: 'N',
    costCenter: '1888456789',
    poNumber: '234577',
    closedDate: '16-10-2025',
    status: 'Invoiced',
    lastUpdate: '17-10-2025',
    projectCost: 21400,
    billableCost: 1400,
    discount: null,
    researchService: 980,
    totalCost: 23780,
  },
  {
    id: 'row-12',
    type: 'video',
    survey: 'Message comprehension',
    company: 'Aperture Science',
    creatorName: 'Uma Patel',
    creatorInitial: 'U',
    costCenter: '1999456789',
    poNumber: '234578',
    closedDate: '17-10-2025',
    status: 'Invoiced',
    lastUpdate: '18-10-2025',
    projectCost: 36600,
    billableCost: 2500,
    discount: 300,
    researchService: 1300,
    totalCost: 40100,
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

function getBillingModalState(row: SurveyBillingRow): BillingModalState {
  const estimatedCompletes = Math.max(1, Math.round(row.projectCost / 100));
  const estimatedEnrichment = Math.max(
    0,
    Math.round(row.researchService / 100),
  );
  const estimatedCpc = row.billableCost / estimatedCompletes;

  return {
    billableCompletes: formatCount(estimatedCompletes),
    billableEnrichment: formatCount(estimatedEnrichment),
    billableCpc: formatCurrency(estimatedCpc),
    billableTotal: formatCurrency(row.billableCost),
    researchServicesCost: formatCurrency(row.researchService),
    otherDiscounts: row.discount === null ? '' : formatCurrency(row.discount),
    totalProjectCost: formatCurrency(row.totalCost),
    costCenter: row.costCenter,
    purchaseOrderCode: row.status === 'Invoiced' ? row.poNumber : '',
    note: '',
  };
}

function areBillingStatesEqual(
  left: BillingModalState | null,
  right: BillingModalState | null,
) {
  if (!left || !right) {
    return false;
  }

  return (
    left.billableCompletes === right.billableCompletes &&
    left.billableEnrichment === right.billableEnrichment &&
    left.billableCpc === right.billableCpc &&
    left.billableTotal === right.billableTotal &&
    left.researchServicesCost === right.researchServicesCost &&
    left.otherDiscounts === right.otherDiscounts &&
    left.totalProjectCost === right.totalProjectCost &&
    left.costCenter === right.costCenter &&
    left.purchaseOrderCode === right.purchaseOrderCode &&
    left.note === right.note
  );
}

function truncateLabel(value: string, maxLength = 42) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function formatPurchaseOrderLabel(poNumber: string, name: string) {
  return `${poNumber} - ${name}`;
}

function formatCostCenterLabel(value: string) {
  return value.replace(/\s*-\s*\d+$/, '').trim();
}

const thBase: React.CSSProperties = {
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 700,
  color: 'var(--ld-semantic-color-text, #2e2f32)',
  padding: '10px 16px',
  borderBottom: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
  whiteSpace: 'nowrap',
};

const thLeft: React.CSSProperties = {
  ...thBase,
  textAlign: 'left',
};

const thRight: React.CSSProperties = {
  ...thBase,
  textAlign: 'right',
};

const tdBase: React.CSSProperties = {
  fontSize: 14,
  lineHeight: '20px',
  color: 'var(--ld-semantic-color-text, #2e2f32)',
  padding: '10px 16px',
  borderBottom: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
  whiteSpace: 'nowrap',
};

const creatorAvatarStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: '999px',
  backgroundColor: 'var(--ld-semantic-color-fill-accent-blue-subtle, #e9f1fe)',
  color: 'var(--ld-semantic-color-text-onfill-accent-blue-subtle, #002e99)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '16px',
  flexShrink: 0,
};

const checkboxCellContentStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
  padding: 0,
};

function getStatusTagStyle(
  status: SurveyBillingRow['status'],
): React.CSSProperties {
  if (status === 'Invoiced') {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 24,
      padding: '4px 8px',
      borderRadius: 2,
      backgroundColor: 'var(--ld-semantic-color-fill-positive-subtle, #eaf3e6)',
      color: 'var(--ld-semantic-color-text-onfill-positive-subtle, #1d5f02)',
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 400,
    };
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 24,
    padding: '4px 8px',
    borderRadius: 2,
    backgroundColor: 'var(--ld-semantic-color-fill-warning-subtle, #fef6de)',
    color: 'var(--ld-semantic-color-text-onfill-warning-subtle, #662b0d)',
    fontSize: 12,
    lineHeight: '16px',
    fontWeight: 400,
  };
}

const tdLeft: React.CSSProperties = {
  ...tdBase,
  textAlign: 'left',
};

const tdRight: React.CSSProperties = {
  ...tdBase,
  textAlign: 'right',
};

const FROZEN_SELECT_WIDTH = 52;
const FROZEN_ACTION_WIDTH = 60;
const FROZEN_PRIMARY_WIDTH = 264;
const FROZEN_ACTION_LEFT = FROZEN_SELECT_WIDTH;
const FROZEN_PRIMARY_LEFT = FROZEN_SELECT_WIDTH + FROZEN_ACTION_WIDTH;
const FROZEN_EDGE_LEFT = FROZEN_PRIMARY_LEFT + FROZEN_PRIMARY_WIDTH;

function stickyCellStyle(
  left: number,
  isHeader: boolean,
  isHovered = false,
  withRightDivider = false,
): React.CSSProperties {
  const backgroundColor = isHeader
    ? 'var(--ld-semantic-color-surface-subtle, #f8f8f8)'
    : isHovered
      ? 'var(--ld-semantic-color-surface-subtle, #f8f8f8)'
      : 'var(--ld-semantic-color-surface, #ffffff)';

  return {
    position: 'sticky',
    left,
    zIndex: withRightDivider ? (isHeader ? 6 : 4) : isHeader ? 4 : 2,
    backgroundColor,
    ...(withRightDivider
      ? {
          boxShadow: '1px 0 0 var(--ld-semantic-color-separator, #e3e4e5)',
        }
      : {}),
  };
}

export function SurveyBillingPage({
  onNavigateToResearcher,
}: SurveyBillingPageProps) {
  const { addSnack } = useSnackbar();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCompany, setSelectedCompany] = React.useState<string>();
  const [selectedClosedDate, setSelectedClosedDate] = React.useState<string>();
  const [selectedCostCenter, setSelectedCostCenter] = React.useState<string>();
  const [selectedPoNumber, setSelectedPoNumber] = React.useState<string>();
  const [selectedRowIds, setSelectedRowIds] = React.useState<Set<string>>(
    new Set(),
  );
  const [hoveredRowId, setHoveredRowId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<PaginationItems>('10');
  const [selectedProject, setSelectedProject] =
    React.useState<SurveyBillingRow | null>(null);
  const [isBillingModalOpen, setIsBillingModalOpen] = React.useState(false);
  const [isEditBillingEnabled, setIsEditBillingEnabled] = React.useState(false);
  const [initialBillingModalState, setInitialBillingModalState] =
    React.useState<BillingModalState | null>(null);
  const [billingModalState, setBillingModalState] =
    React.useState<BillingModalState | null>(null);
  const [isSendToInvoicingConfirmOpen, setIsSendToInvoicingConfirmOpen] =
    React.useState(false);
  const [selectedSurveysForInvoicing, setSelectedSurveysForInvoicing] =
    React.useState<SurveyBillingRow[]>([]);

  React.useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    selectedCompany,
    selectedClosedDate,
    selectedCostCenter,
    selectedPoNumber,
  ]);

  const companyOptions = React.useMemo(() => {
    return Array.from(
      new Set(SURVEY_BILLING_ROWS.map((row) => row.company)),
    ).map((company) => ({
      id: company,
      label: company,
    }));
  }, []);

  const closedDateOptions = React.useMemo(() => {
    return Array.from(
      new Set(SURVEY_BILLING_ROWS.map((row) => row.closedDate)),
    ).map((closedDate) => ({
      id: closedDate,
      label: closedDate,
    }));
  }, []);

  const costCenterOptions = React.useMemo(() => {
    return Array.from(
      new Set(SURVEY_BILLING_ROWS.map((row) => row.costCenter)),
    ).map((costCenter) => ({
      id: costCenter,
      label: costCenter,
    }));
  }, []);

  const poNumberOptions = React.useMemo(() => {
    return Array.from(
      new Set(SURVEY_BILLING_ROWS.map((row) => row.poNumber)),
    ).map((poNumber) => ({
      id: poNumber,
      label: poNumber,
    }));
  }, []);

  const poSelectOptions = React.useMemo(
    () =>
      poNumberOptions.map((option) => ({
        key: option.id,
        label: option.label,
      })),
    [poNumberOptions],
  );

  const purchaseOrderOptionsByPoNumber = React.useMemo(() => {
    const uniqueByPoNumber = new Map<string, BillingPurchaseOrderOption>();

    SHARED_PURCHASE_ORDER_OPTIONS.forEach((purchaseOrder) => {
      if (!uniqueByPoNumber.has(purchaseOrder.id)) {
        uniqueByPoNumber.set(purchaseOrder.id, {
          key: purchaseOrder.id,
          label: purchaseOrder.label,
          costCenter: purchaseOrder.costCenter,
          availableBalance: purchaseOrder.availableBalance,
          validThrough: purchaseOrder.validThrough,
        });
      }
    });

    return uniqueByPoNumber;
  }, []);

  const budgetPurchaseOrderOptions = React.useMemo(() => {
    return Array.from(purchaseOrderOptionsByPoNumber.values()).map(
      ({ key, label }) => ({
        key,
        label,
      }),
    );
  }, [purchaseOrderOptionsByPoNumber]);

  const filteredRows = React.useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return SURVEY_BILLING_ROWS.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        row.company.toLowerCase().includes(query) ||
        row.survey.toLowerCase().includes(query) ||
        row.poNumber.toLowerCase().includes(query) ||
        row.costCenter.toLowerCase().includes(query);

      const matchesCompany =
        !selectedCompany || row.company === selectedCompany;
      const matchesClosedDate =
        !selectedClosedDate || row.closedDate === selectedClosedDate;
      const matchesCostCenter =
        !selectedCostCenter || row.costCenter === selectedCostCenter;
      const matchesPoNumber =
        !selectedPoNumber || row.poNumber === selectedPoNumber;

      return (
        matchesSearch &&
        matchesCompany &&
        matchesClosedDate &&
        matchesCostCenter &&
        matchesPoNumber
      );
    });
  }, [
    searchTerm,
    selectedCompany,
    selectedClosedDate,
    selectedCostCenter,
    selectedPoNumber,
  ]);

  const pagedRows = React.useMemo(() => {
    const numericItemsPerPage = Number(itemsPerPage);
    const startIndex = (page - 1) * numericItemsPerPage;
    return filteredRows.slice(startIndex, startIndex + numericItemsPerPage);
  }, [filteredRows, page, itemsPerPage]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredRows.length / Number(itemsPerPage)),
  );
  const safePage = Math.min(page, pageCount);

  const pagedRowIds = React.useMemo(
    () => pagedRows.map((row) => row.id),
    [pagedRows],
  );

  const selectedOnPageCount = React.useMemo(
    () => pagedRowIds.filter((id) => selectedRowIds.has(id)).length,
    [pagedRowIds, selectedRowIds],
  );

  const isAllVisibleSelected =
    pagedRowIds.length > 0 && selectedOnPageCount === pagedRowIds.length;

  const isSomeVisibleSelected =
    selectedOnPageCount > 0 && selectedOnPageCount < pagedRowIds.length;

  React.useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const isModalDirty = React.useMemo(() => {
    if (!billingModalState || !initialBillingModalState) {
      return false;
    }

    return !areBillingStatesEqual(billingModalState, initialBillingModalState);
  }, [billingModalState, initialBillingModalState]);

  const selectedProjectPoSelectOptions = React.useMemo(() => {
    if (budgetPurchaseOrderOptions.length > 0) {
      return budgetPurchaseOrderOptions;
    }

    return poSelectOptions;
  }, [budgetPurchaseOrderOptions, poSelectOptions]);

  const selectedBillingPurchaseOrder = React.useMemo(() => {
    if (!billingModalState?.purchaseOrderCode) {
      return undefined;
    }

    return purchaseOrderOptionsByPoNumber.get(
      billingModalState.purchaseOrderCode,
    );
  }, [billingModalState?.purchaseOrderCode, purchaseOrderOptionsByPoNumber]);

  const isBillingBalanceShort = Boolean(
    selectedProject &&
    selectedBillingPurchaseOrder &&
    selectedBillingPurchaseOrder.availableBalance < selectedProject.totalCost,
  );

  const billingBalanceCovered = selectedProject
    ? selectedBillingPurchaseOrder
      ? Math.min(
          selectedBillingPurchaseOrder.availableBalance,
          selectedProject.totalCost,
        )
      : 0
    : 0;

  const billingInvoicedSeparately = selectedProject
    ? selectedBillingPurchaseOrder
      ? Math.max(
          selectedProject.totalCost -
            selectedBillingPurchaseOrder.availableBalance,
          0,
        )
      : 0
    : 0;

  const openBillingModal = React.useCallback(
    (row: SurveyBillingRow) => {
      const nextModalState = getBillingModalState(row);
      const selectedPurchaseOrder = nextModalState.purchaseOrderCode
        ? purchaseOrderOptionsByPoNumber.get(nextModalState.purchaseOrderCode)
        : undefined;

      if (selectedPurchaseOrder) {
        nextModalState.costCenter = formatCostCenterLabel(
          selectedPurchaseOrder.costCenter,
        );
        nextModalState.purchaseOrderCode = selectedPurchaseOrder.key;
      } else {
        nextModalState.costCenter = '';
        nextModalState.purchaseOrderCode = '';
      }

      setSelectedProject(row);
      setInitialBillingModalState(nextModalState);
      setBillingModalState(nextModalState);
      setIsEditBillingEnabled(false);
      setIsBillingModalOpen(true);
    },
    [purchaseOrderOptionsByPoNumber],
  );

  const closeBillingModal = React.useCallback(() => {
    setIsBillingModalOpen(false);
    setSelectedProject(null);
    setInitialBillingModalState(null);
    setBillingModalState(null);
    setIsEditBillingEnabled(false);
  }, []);

  const isBackendReadOnlyField = (
    field:
      | 'billableCompletes'
      | 'billableEnrichment'
      | 'billableCpc'
      | 'billableTotal',
  ) => {
    return (
      field === 'billableCompletes' ||
      field === 'billableEnrichment' ||
      field === 'billableCpc' ||
      field === 'billableTotal'
    );
  };

  const isFieldReadOnly = (
    field:
      | 'billableCompletes'
      | 'billableEnrichment'
      | 'billableCpc'
      | 'billableTotal'
      | 'researchServicesCost'
      | 'otherDiscounts'
      | 'totalProjectCost'
      | 'costCenter'
      | 'purchaseOrderCode'
      | 'note',
  ) => {
    // Billable fields are always readonly (calculated from backend)
    if (
      isBackendReadOnlyField(
        field as
          | 'billableCompletes'
          | 'billableEnrichment'
          | 'billableCpc'
          | 'billableTotal',
      )
    ) {
      return true;
    }

    // Cost center is always readonly
    if (field === 'costCenter') {
      return true;
    }

    // For Pending invoice surveys: most fields are editable
    if (selectedProject?.status === 'Pending invoice') {
      return false;
    }

    // For Invoiced surveys: fields are readonly until Edit billing is enabled
    if (field === 'researchServicesCost') {
      return !isEditBillingEnabled;
    }

    if (field === 'otherDiscounts') {
      return !isEditBillingEnabled;
    }

    if (field === 'purchaseOrderCode') {
      return !isEditBillingEnabled;
    }

    if (field === 'note') {
      return !isEditBillingEnabled;
    }

    return true;
  };

  const updateBillingField = <K extends keyof BillingModalState>(
    key: K,
    value: BillingModalState[K],
  ) => {
    setBillingModalState((current) => {
      if (!current) {
        return current;
      }

      if (key === 'purchaseOrderCode') {
        const nextPurchaseOrder = purchaseOrderOptionsByPoNumber.get(
          String(value),
        );

        return {
          ...current,
          purchaseOrderCode: String(value),
          costCenter: nextPurchaseOrder
            ? formatCostCenterLabel(nextPurchaseOrder.costCenter)
            : '',
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
  };

  const columns = React.useMemo(
    () => [
      {
        id: 'select',
        accessorFn: () => null,
        header: () => (
          <div style={checkboxCellContentStyle}>
            <Checkbox
              label={
                <VisuallyHidden>Select all visible billing rows</VisuallyHidden>
              }
              checked={isAllVisibleSelected}
              indeterminate={isSomeVisibleSelected}
              onChange={(event) => {
                const checked = event.target.checked;
                setSelectedRowIds((current) => {
                  const next = new Set(current);
                  if (checked) {
                    pagedRowIds.forEach((id) => next.add(id));
                  } else {
                    pagedRowIds.forEach((id) => next.delete(id));
                  }
                  return next;
                });
              }}
              size="small"
            />
          </div>
        ),
        size: 60,
        minSize: 60,
        maxSize: 60,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyBillingRow } }) => {
          const isSelected = selectedRowIds.has(row.original.id);
          const isInvoiced = row.original.status === 'Invoiced';

          return (
            <div style={checkboxCellContentStyle}>
              <Checkbox
                label={
                  <VisuallyHidden>{`Select row for ${row.original.company}`}</VisuallyHidden>
                }
                checked={isSelected}
                disabled={isInvoiced}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setSelectedRowIds((current) => {
                    const next = new Set(current);
                    if (checked) {
                      next.add(row.original.id);
                    } else {
                      next.delete(row.original.id);
                    }
                    return next;
                  });
                }}
                size="small"
              />
            </div>
          );
        },
      },
      {
        id: 'type',
        accessorFn: () => null,
        header: 'Type',
        size: 60,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyBillingRow } }) =>
          row.original.type === 'article' ? (
            <LDIcon.Article size="small" aria-hidden />
          ) : (
            <LDIcon.Play size="small" aria-hidden />
          ),
      },
      {
        accessorKey: 'survey',
        header: 'Survey',
        size: 264,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyBillingRow } }) => (
          <LinkButton
            onClick={() => openBillingModal(row.original)}
            size="small"
            color="default"
            aria-label={`Open billing details for ${row.original.survey}`}
          >
            {row.original.survey}
          </LinkButton>
        ),
      },
      {
        accessorKey: 'company',
        header: 'Company',
        size: 160,
        enableSorting: false,
      },
      {
        id: 'creator',
        accessorFn: () => null,
        header: 'Creator',
        size: 180,
        enableSorting: false,
        cell: ({ row }: { row: { original: SurveyBillingRow } }) => (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={creatorAvatarStyle}>
              {row.original.creatorInitial}
            </span>
            {row.original.creatorName}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 136,
        enableSorting: true,
        cell: ({ row }: { row: { original: SurveyBillingRow } }) => (
          <span style={getStatusTagStyle(row.original.status)}>
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: 'costCenter',
        header: 'Cost center',
        size: 120,
        enableSorting: false,
      },
      {
        accessorKey: 'poNumber',
        header: 'PO number',
        size: 120,
        enableSorting: false,
      },
      {
        accessorKey: 'closedDate',
        header: 'Closed date',
        size: 120,
        enableSorting: false,
      },
      {
        accessorKey: 'lastUpdate',
        header: 'Last update',
        size: 150,
        enableSorting: true,
      },
      {
        id: 'projectCost',
        accessorFn: (row: SurveyBillingRow) => row.projectCost,
        header: 'Project cost',
        size: 130,
        enableSorting: false,
        meta: { textAlign: 'right' as const, skipDivWrapper: true },
        cell: ({ row }: { row: { original: SurveyBillingRow } }) =>
          formatCurrency(row.original.projectCost),
      },
      {
        id: 'billableCost',
        accessorFn: (row: SurveyBillingRow) => row.billableCost,
        header: 'Billable cost',
        size: 130,
        enableSorting: false,
        meta: { textAlign: 'right' as const, skipDivWrapper: true },
        cell: ({ row }: { row: { original: SurveyBillingRow } }) =>
          formatCurrency(row.original.billableCost),
      },
      {
        id: 'discount',
        accessorFn: (row: SurveyBillingRow) => row.discount,
        header: 'Discount',
        size: 120,
        enableSorting: false,
        meta: { textAlign: 'right' as const, skipDivWrapper: true },
        cell: ({ row }: { row: { original: SurveyBillingRow } }) =>
          row.original.discount === null
            ? '--'
            : formatCurrency(row.original.discount),
      },
      {
        id: 'researchService',
        accessorFn: (row: SurveyBillingRow) => row.researchService,
        header: 'Research service',
        size: 150,
        enableSorting: false,
        meta: { textAlign: 'right' as const, skipDivWrapper: true },
        cell: ({ row }: { row: { original: SurveyBillingRow } }) =>
          formatCurrency(row.original.researchService),
      },
      {
        id: 'totalCost',
        accessorFn: (row: SurveyBillingRow) => row.totalCost,
        header: 'Total cost',
        size: 130,
        enableSorting: false,
        meta: { textAlign: 'right' as const, skipDivWrapper: true },
        cell: ({ row }: { row: { original: SurveyBillingRow } }) =>
          formatCurrency(row.original.totalCost),
      },
    ],
    [
      isAllVisibleSelected,
      isSomeVisibleSelected,
      pagedRowIds,
      selectedRowIds,
      openBillingModal,
    ],
  );

  return (
    <>
      <div
        style={{ backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)' }}
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
            { label: 'Survey billing', href: '#', isCurrent: true },
          ]}
          description="Review and edit survey billing details, invoice completed surveys, and track billing status"
        >
          Survey billing
        </PageHeader>
      </div>

      <div style={{ padding: 24 }}>
        <div
          className="survey-billing-table-wrapper"
          style={{
            backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <DvTable.Toolbar className="survey-billing-table-toolbar">
            <DvTable.Search
              className="survey-billing-table-search"
              placeholder="Search"
              value={searchTerm}
              onSearch={setSearchTerm}
              debounceDelay={0}
            />

            <DvTable.Filters className="survey-billing-table-filters">
              <MenuSingleSelect
                className="survey-billing-table-filter"
                placeholder={`Company (${selectedCompany ? 1 : 0})`}
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
                className="survey-billing-table-filter"
                placeholder={`Closed date (${selectedClosedDate ? 1 : 0})`}
                options={closedDateOptions}
                selectedOptionId={selectedClosedDate}
                onSelect={(optionId) => {
                  setSelectedClosedDate((current) =>
                    current === optionId ? undefined : optionId,
                  );
                }}
                variant="filter"
              />

              <MenuSingleSelect
                className="survey-billing-table-filter"
                placeholder={`Cost center (${selectedCostCenter ? 1 : 0})`}
                options={costCenterOptions}
                selectedOptionId={selectedCostCenter}
                onSelect={(optionId) => {
                  setSelectedCostCenter((current) =>
                    current === optionId ? undefined : optionId,
                  );
                }}
                variant="filter"
              />

              <MenuSingleSelect
                className="survey-billing-table-filter"
                placeholder={`PO number (${selectedPoNumber ? 1 : 0})`}
                options={poNumberOptions}
                selectedOptionId={selectedPoNumber}
                onSelect={(optionId) => {
                  setSelectedPoNumber((current) =>
                    current === optionId ? undefined : optionId,
                  );
                }}
                variant="filter"
              />
            </DvTable.Filters>

            <div className="survey-billing-toolbar-actions">
              <LDIconButton
                a11yLabel="Export survey billing"
                variant="secondary"
                size="small"
              >
                <LDIcon.Download size="small" aria-hidden />
              </LDIconButton>
            </div>
          </DvTable.Toolbar>

          <div style={{ overflowX: 'auto' }}>
            <DvTable
              columns={columns as any}
              data={pagedRows as any}
              compact
              frozenColumns={{ left: ['select', 'type', 'survey'] }}
              emptyState={{
                title: 'No results found',
                description:
                  'Try adjusting your search term or filters to find billing rows.',
              }}
              isFilterOrSearchActive={
                searchTerm.trim().length > 0 ||
                !!selectedCompany ||
                !!selectedClosedDate ||
                !!selectedCostCenter ||
                !!selectedPoNumber
              }
              bulkActions={[
                {
                  id: 'send-to-invoicing',
                  label: 'Send to invoicing',
                  onClick: (selectedRows) => {
                    const surveysToSend = SURVEY_BILLING_ROWS.filter((row) =>
                      selectedRowIds.has(row.id),
                    );
                    setSelectedSurveysForInvoicing(surveysToSend);
                    setIsSendToInvoicingConfirmOpen(true);
                  },
                  variant: 'primary',
                },
              ]}
              selectedRowCount={selectedRowIds.size}
              onClearSelected={() => {
                setSelectedRowIds(new Set());
              }}
            />
          </div>

          <div style={{ padding: 16 }}>
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
              totalItemCount={filteredRows.length}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isBillingModalOpen}
        onClose={closeBillingModal}
        title={selectedProject?.survey ?? 'Survey billing'}
        description="Review and make changes to project billing costs."
        size="medium"
        actions={
          isEditBillingEnabled ||
          selectedProject?.status === 'Pending invoice' ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
              }}
            >
              <Button variant="secondary" onClick={closeBillingModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  closeBillingModal();
                  addSnack({ message: 'Billing information updated' });
                }}
                disabled={!isModalDirty}
              >
                {selectedProject?.status === 'Invoiced'
                  ? 'Save and send to invoicing'
                  : 'Save changes'}
              </Button>
            </div>
          ) : undefined
        }
      >
        {selectedProject && billingModalState ? (
          <div
            className="survey-billing-modal"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {!isEditBillingEnabled && selectedProject.status === 'Invoiced' ? (
              <Alert
                variant="info"
                showCloseButton={false}
                actionButtonProps={{
                  children: 'Edit billing',
                  onClick: () => {
                    setIsEditBillingEnabled(true);
                    setBillingModalState((current) => {
                      if (!current) {
                        return current;
                      }

                      return {
                        ...current,
                        purchaseOrderCode: '',
                        costCenter: '',
                      };
                    });
                    setInitialBillingModalState((current) => {
                      if (!current) {
                        return current;
                      }

                      return {
                        ...current,
                        purchaseOrderCode: '',
                        costCenter: '',
                      };
                    });
                  },
                }}
              >
                This survey has already been invoiced. To avoid invoice
                mismatches, billing fields are locked by default.
              </Alert>
            ) : null}

            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: '20px',
                fontWeight: 700,
                color: 'var(--ld-semantic-color-text, #2e2f32)',
              }}
            >
              Survey cost
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <TextField
                label="Billable completes"
                value={billingModalState.billableCompletes}
                onChange={(event) =>
                  updateBillingField('billableCompletes', event.target.value)
                }
                readOnly={isFieldReadOnly('billableCompletes')}
              />
              <TextField
                label="Billable enrichment"
                value={billingModalState.billableEnrichment}
                onChange={(event) =>
                  updateBillingField('billableEnrichment', event.target.value)
                }
                readOnly={isFieldReadOnly('billableEnrichment')}
              />
              <TextField
                label="Billable CPC"
                value={billingModalState.billableCpc}
                onChange={(event) =>
                  updateBillingField('billableCpc', event.target.value)
                }
                readOnly={isFieldReadOnly('billableCpc')}
              />
              <TextField
                label="Billable total"
                value={billingModalState.billableTotal}
                onChange={(event) =>
                  updateBillingField('billableTotal', event.target.value)
                }
                readOnly={isFieldReadOnly('billableTotal')}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <TextField
                label="Research services cost"
                value={billingModalState.researchServicesCost}
                onChange={(event) =>
                  updateBillingField('researchServicesCost', event.target.value)
                }
                readOnly={isFieldReadOnly('researchServicesCost')}
              />
              <TextField
                label="Other discounts"
                value={billingModalState.otherDiscounts}
                onChange={(event) =>
                  updateBillingField('otherDiscounts', event.target.value)
                }
                readOnly={isFieldReadOnly('otherDiscounts')}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 16,
                padding: '4px 16px 4px 0',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily:
                    "var(--ld-semantic-font-body-medium-family, 'Everyday_Sans_UI')",
                  fontSize: 'var(--ld-semantic-font-body-medium-size, 16px)',
                  lineHeight:
                    'var(--ld-semantic-font-body-medium-lineheight, 24px)',
                  fontWeight:
                    'var(--ld-semantic-font-body-medium-weight-default, 400)',
                  color: 'var(--ld-semantic-color-text, #2e2f32)',
                }}
              >
                Total project cost
              </p>
              <div
                style={{
                  fontFamily:
                    "var(--ld-semantic-font-body-large-family, 'Everyday_Sans_UI')",
                  fontSize: 'var(--ld-semantic-font-body-large-size, 18px)',
                  lineHeight:
                    'var(--ld-semantic-font-body-large-lineheight, 24px)',
                  fontWeight:
                    'var(--ld-semantic-font-body-large-weight-alt, 600)',
                  color: 'var(--ld-semantic-color-text, #2e2f32)',
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                }}
              >
                {billingModalState.totalProjectCost}
              </div>
            </div>

            <Divider />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: '20px',
                  fontWeight: 700,
                  color: 'var(--ld-semantic-color-text, #2e2f32)',
                }}
              >
                Bill to
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily:
                    "var(--ld-semantic-font-body-small-family, 'Everyday_Sans_UI')",
                  fontSize: 'var(--ld-semantic-font-body-small-size, 12px)',
                  lineHeight:
                    'var(--ld-semantic-font-body-small-lineheight, 16px)',
                  fontWeight:
                    'var(--ld-semantic-font-body-small-weight-default, 400)',
                  color: 'var(--ld-semantic-color-text-subtlest, #74767c)',
                }}
              >
                Choose purchase order that will be charged for this survey
              </p>
            </div>

            <div style={{ width: 320, maxWidth: '100%', minWidth: 0 }}>
              <Select
                className="survey-billing-modal-select"
                label="Purchase order"
                size="large"
                options={selectedProjectPoSelectOptions}
                value={billingModalState.purchaseOrderCode}
                onChange={(value) =>
                  updateBillingField('purchaseOrderCode', value)
                }
                placeholder="Select an option"
                isFullWidth
                scrollableDivId="survey-billing-purchase-order-menu"
                disabled={isFieldReadOnly('purchaseOrderCode')}
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                paddingTop: 4,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 16,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: 'var(--ld-semantic-color-text, #2e2f32)',
                }}
              >
                <span>Cost center</span>
                <strong style={{ textAlign: 'right' }}>
                  {billingModalState.costCenter || '--'}
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 16,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: 'var(--ld-semantic-color-text, #2e2f32)',
                }}
              >
                <span>Available balance</span>
                <strong style={{ textAlign: 'right' }}>
                  {selectedBillingPurchaseOrder
                    ? formatCurrency(
                        selectedBillingPurchaseOrder.availableBalance,
                      )
                    : '--'}
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 16,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: 'var(--ld-semantic-color-text, #2e2f32)',
                }}
              >
                <span>Valid through</span>
                <strong style={{ textAlign: 'right' }}>
                  {selectedBillingPurchaseOrder?.validThrough ?? '--'}
                </strong>
              </div>
            </div>

            {isBillingBalanceShort ? (
              <Alert variant="info" showCloseButton={false}>
                You can still submit the survey as planned. Available balance
                will cover {formatCurrency(billingBalanceCovered)}{' '}
                {formatCurrency(billingInvoicedSeparately)} will be invoiced
                separately.
              </Alert>
            ) : null}

            <TextArea
              label={
                <span style={{ fontWeight: 400 }}>
                  Reason for billing change
                </span>
              }
              value={billingModalState.note}
              onChange={(event) =>
                updateBillingField('note', event.target.value)
              }
              placeholder="Reason for billing change"
              readOnly={isFieldReadOnly('note')}
              textAreaProps={{
                rows: 2,
                style: {
                  minHeight: 60,
                  resize: 'none',
                  width: '100%',
                },
              }}
            />
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={isSendToInvoicingConfirmOpen}
        onClose={() => setIsSendToInvoicingConfirmOpen(false)}
        title="Do you want to send the following projects to billing?"
        actions={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button
              variant="secondary"
              onClick={() => setIsSendToInvoicingConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                addSnack({ message: 'Surveys sent to invoicing' });
                setSelectedRowIds(new Set());
                setIsSendToInvoicingConfirmOpen(false);
                setSelectedSurveysForInvoicing([]);
              }}
            >
              Send
            </Button>
          </div>
        }
      >
        <ul
          style={{
            margin: '0',
            paddingLeft: 0,
            fontSize: 14,
            lineHeight: '20px',
            color: 'var(--ld-semantic-color-text, #2e2f32)',
          }}
        >
          {selectedSurveysForInvoicing.map((survey) => (
            <li
              key={survey.id}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {survey.type === 'article' ? (
                <LDIcon.Article size="small" aria-hidden />
              ) : (
                <LDIcon.Play size="small" aria-hidden />
              )}
              {survey.survey}
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
