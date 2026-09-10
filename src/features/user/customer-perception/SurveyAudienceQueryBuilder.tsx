import * as React from 'react';
import './SurveyAudienceQueryBuilder.css';
import {
  DvMenuItem,
  IconButton as LDIconButton,
  LDIcon,
  Button as LDButton,
  MenuAction,
  MenuSingleSelect,
  Modal,
  Select as LDSelect,
} from '@walmart-dataventures/shared-components';
import { Radio } from '../../../components/Radio';
import { LinkButton } from '../../../components/LinkButton';
import { ChooseWalmartStoresModal } from './ChooseWalmartStoresModal';
import { ChooseSavedStoreGroupsModal } from './ChooseSavedStoreGroupsModal';
import { ChooseBrandsModal } from './ChooseBrandsModal';

type QueryBuilderFlowKind =
  | 'product'
  | 'brands'
  | 'store'
  | 'saved-store-groups'
  | 'date';

type QueryBuilderFlowState = {
  kind: QueryBuilderFlowKind;
  title: string;
  rowId: string;
} | null;

function SurveyAudienceFlowModal({
  isOpen,
  title,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="medium">
      <div
        style={{
          padding: '0 24px 24px',
          minHeight: 420,
        }}
      />
    </Modal>
  );
}

type QueryBuilderRowState = {
  id: string;
  subjectConditionId?: string;
  conditionId?: string;
  productId?: string;
  purchaseChannelId?: string;
  storeId?: string;
  selectedStoreIds?: string[];
  selectedSavedStoreGroupIds?: string[];
  selectedBrandIds?: string[];
  dateId?: string;
  selectedHealthSubConditionId?: string;
  healthTreatmentId?: string;
};

type QueryConnector = 'or' | 'and';

type SelectOption = {
  id: string;
  label: string;
  isHeader?: boolean;
};

const CONDITION_SELECT_OPTIONS: SelectOption[] = [
  {
    id: 'purchase-behavior-header',
    label: 'Purchase behavior',
    isHeader: true,
  },
  { id: 'purchased', label: 'Purchased' },
  { id: 'did-not-purchase', label: 'Did not purchase' },
  {
    id: 'demographic-household-header',
    label: 'Demographic/Household',
    isHeader: true,
  },
  { id: 'are-any-of', label: 'Are any of' },
  { id: 'are', label: 'Are' },
  { id: 'are-none-of', label: 'Are none of' },
  { id: 'are-not', label: 'Are not' },
  {
    id: 'health-condition-header',
    label: 'Health condition',
    isHeader: true,
  },
  {
    id: 'have-health-information',
    label: 'Have agreed to share health data',
  },
];

const SUB_COMMUNITY_CONDITION_OPTIONS: SelectOption[] = [
  { id: 'are-in-health and wellness community', label: 'Are in the health and wellness community' },
  { id: 'are-not-in-health and wellness community', label: 'Are NOT in the health and wellness community' },
];

const PRODUCT_SELECT_OPTIONS: SelectOption[] = [
  {
    id: 'product-header',
    label: 'Select product from',
    isHeader: true,
  },
  { id: 'walmart-hierarchy', label: 'Walmart hierarchy' },
  { id: 'upload-upcs', label: 'Upload UPCs' },
  { id: 'juice-box', label: 'Juice box' },
  { id: 'brands', label: 'Brands' },
];

const PURCHASE_CHANNEL_OPTIONS: SelectOption[] = [
  { id: 'online', label: 'Online' },
  { id: 'in-store', label: 'In-store' },
  { id: 'both-in-store-and-online', label: 'Both in store and online' },
  { id: 'in-store-or-online', label: 'In store or online' },
];

const STORE_SELECT_OPTIONS: SelectOption[] = [
  {
    id: 'store-filter-header',
    label: 'Select filter',
    isHeader: true,
  },
  { id: 'any-walmart-stores', label: 'Any Walmart stores' },
  { id: 'choose-from-walmart-stores', label: 'Choose from Walmart stores' },
  { id: 'upload-store-list', label: 'Upload store list' },
  {
    id: 'choose-from-saved-groups',
    label: 'Choose from store groups',
  },
];

const DATE_SELECT_OPTIONS: SelectOption[] = [
  { id: 'last-1-month', label: 'Last 1 month' },
  { id: 'last-3-month', label: 'Last 3 month' },
  { id: 'last-6-month', label: 'Last 6 month' },
  { id: 'last-12-month', label: 'Last 12 month' },
  { id: 'last-18-month', label: 'Last 18 month' },
  { id: 'date-range', label: 'Date range' },
];

const QUERY_CONNECTOR_OPTIONS: Array<{ key: QueryConnector; label: string }> = [
  { key: 'or', label: 'or' },
  { key: 'and', label: 'and' },
];

const HEALTH_CONDITION_ID = 'have-health-information';

const HEALTH_TREATMENT_OPTIONS: SelectOption[] = [
  { id: 'is', label: 'Are currently prescribed medication, a medical device, or both' },
  { id: 'is-not', label: 'Are NOT currently prescribed medication, a medical device, or both' },
];

const HEALTH_SUB_CONDITION_OPTIONS: SelectOption[] = [
  { id: 'acid-reflux-gerd', label: 'Acid Reflux (GERD)' },
  { id: 'acne', label: 'Acne' },
  { id: 'add-adhd', label: 'ADD / ADHD' },
  { id: 'allergies-severe', label: 'Allergies (Severe)' },
  { id: 'alopecia', label: 'Alopecia' },
  { id: 'alzheimers-dementia', label: "Alzheimer's Disease and Dementia" },
  { id: 'ankylosing-spondylitis', label: 'Ankylosing Spondylitis' },
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'asthma', label: 'Asthma' },
  { id: 'bipolar-disorder', label: 'Bipolar Disorder I & II' },
  { id: 'cancer', label: 'Cancer' },
  { id: 'cardiovascular-disease', label: 'Cardiovascular Disease' },
  { id: 'chronic-kidney-disease', label: 'Chronic Kidney Disease (CKD)' },
  { id: 'copd', label: 'Chronic Obstructive Pulmonary Disease (COPD)' },
  { id: 'chronic-pain', label: 'Chronic Pain' },
  { id: 'crohns-disease', label: "Crohn's Disease" },
  { id: 'cystic-fibrosis', label: 'Cystic fibrosis' },
  { id: 'depression', label: 'Depression' },
  { id: 'diabetic-retinopathy', label: 'Diabetic Retinopathy' },
  { id: 'eczema-atopic-dermatitis', label: 'Eczema/ Atopic Dermatitis' },
  { id: 'endometriosis', label: 'Endometriosis' },
  { id: 'epilepsy', label: 'Epilepsy' },
  { id: 'erectile-dysfunction', label: 'Erectile Dysfunction' },
  { id: 'fibromyalgia', label: 'Fibromyalgia' },
  { id: 'glaucoma', label: 'Glaucoma' },
  { id: 'gout', label: 'Gout' },
  { id: 'hair-loss-baldness', label: 'Hair loss/ Baldness' },
  { id: 'hemophilia', label: 'Hemophilia' },
  { id: 'hepatitis-b-c', label: 'Hepatitis (B/C)' },
  { id: 'hepatitis-c', label: 'Hepatitis C' },
  { id: 'high-cholesterol', label: 'High Cholesterol' },
  { id: 'hiv-aids', label: 'HIV/AIDS' },
  { id: 'huntingtons-disease', label: "Huntington's Disease" },
  { id: 'hypertension', label: 'Hypertension/ High Blood Pressure' },
  { id: 'inflammatory-bowel-disease', label: 'Inflammatory Bowel Disease (IBD)' },
  { id: 'insomnia', label: 'Insomnia' },
  { id: 'insulin-resistant-prediabetes', label: 'Insulin resistant / prediabetes' },
  { id: 'irritable-bowel-syndrome', label: 'Irritable Bowel Syndrome (IBS)' },
  { id: 'lupus', label: 'Lupus' },
  { id: 'menopause-perimenopause', label: 'Menopause/ Perimenopause' },
  { id: 'migraine', label: 'Migraine' },
  { id: 'multiple-sclerosis', label: 'Multiple Sclerosis' },
  { id: 'obesity-weight-related', label: 'Obesity or weight-related issues' },
  { id: 'ocd', label: 'Obsessive Compulsive Disorder (OCD)' },
  { id: 'osteoarthritis', label: 'Osteoarthritis' },
  { id: 'osteoporosis', label: 'Osteoporosis' },
  { id: 'other-psychiatric-disorder', label: 'Other Psychiatric disorder SPECIFY' },
  { id: 'overactive-bladder', label: 'Overactive Bladder' },
  { id: 'parkinsons-disease', label: "Parkinson's Disease" },
  { id: 'pcos', label: 'Polycystic Ovary Syndrome (PCOS)' },
  { id: 'psoriasis', label: 'Psoriasis' },
  { id: 'psoriatic-arthritis', label: 'Psoriatic Arthritis' },
  { id: 'rheumatoid-arthritis', label: 'Rheumatoid Arthritis' },
  { id: 'schizophrenia', label: 'Schizophrenia' },
  { id: 'seasonal-allergy', label: 'Seasonal Allergy' },
  { id: 'sleep-apnea', label: 'Sleep Apnea' },
  { id: 'tardive-dyskinesia', label: 'Tardive Dyskinesia' },
  { id: 'thyroid-disease', label: 'Thyroid Disease' },
  { id: 'type-1-diabetes', label: 'Type 1 Diabetes' },
  { id: 'type-2-diabetes', label: 'Type 2 Diabetes' },
  { id: 'ulcerative-colitis', label: 'Ulcerative Collitis' },
  { id: 'wet-amd', label: 'Wet AMD' },
];

type HealthSubConditionCategory = { group: string; items: string[] };

const HEALTH_SUB_CONDITION_CATEGORIES: HealthSubConditionCategory[] = [
  {
    group: 'Allergies & Respiratory',
    items: ['Allergies (Severe)', 'Asthma', 'Chronic Obstructive Pulmonary Disease (COPD)', 'Cystic fibrosis', 'Seasonal Allergy'],
  },
  { group: 'Cancer', items: ['Cancer'] },
  {
    group: 'Cardiovascular & Metabolic',
    items: ['Cardiovascular Disease', 'Chronic Kidney Disease (CKD)', 'High Cholesterol', 'Hypertension/ High Blood Pressure', 'Insulin resistant / prediabetes', 'Obesity or weight-related issues', 'Type 1 Diabetes', 'Type 2 Diabetes'],
  },
  {
    group: 'Dermatology',
    items: ['Acne', 'Alopecia', 'Eczema/ Atopic Dermatitis', 'Hair loss/ Baldness', 'Psoriasis'],
  },
  {
    group: 'Digestive & GI',
    items: ['Acid Reflux (GERD)', "Crohn's Disease", 'Inflammatory Bowel Disease (IBD)', 'Irritable Bowel Syndrome (IBS)', 'Ulcerative Collitis'],
  },
  { group: 'Eyes', items: ['Diabetic Retinopathy', 'Glaucoma', 'Wet AMD'] },
  {
    group: 'Infectious & Immune',
    items: ['Hemophilia', 'Hepatitis (B/C)', 'Hepatitis C', 'HIV/AIDS', 'Lupus'],
  },
  {
    group: 'Mental Health & Neurological',
    items: ['ADD / ADHD', "Alzheimer's Disease and Dementia", 'Anxiety', 'Bipolar Disorder I & II', 'Depression', 'Epilepsy', "Huntington's Disease", 'Migraine', 'Multiple Sclerosis', 'Obsessive Compulsive Disorder (OCD)', 'Other Psychiatric disorder SPECIFY', "Parkinson's Disease", 'Schizophrenia', 'Tardive Dyskinesia'],
  },
  {
    group: 'Musculoskeletal',
    items: ['Ankylosing Spondylitis', 'Fibromyalgia', 'Gout', 'Osteoarthritis', 'Osteoporosis', 'Psoriatic Arthritis', 'Rheumatoid Arthritis'],
  },
  { group: 'Pain & Sleep', items: ['Chronic Pain', 'Insomnia', 'Sleep Apnea'] },
  {
    group: 'Reproductive & Hormonal',
    items: ['Endometriosis', 'Erectile Dysfunction', 'Menopause/ Perimenopause', 'Polycystic Ovary Syndrome (PCOS)', 'Thyroid Disease'],
  },
  { group: 'Urological', items: ['Overactive Bladder'] },
];

const PURCHASE_BEHAVIOR_CONDITION_IDS = new Set([
  'purchased',
  'did-not-purchase',
]);
const STORE_REQUIRED_CHANNEL_IDS = new Set([
  'in-store',
  'both-in-store-and-online',
  'in-store-or-online',
]);
const PRODUCT_MODAL_OPTION_IDS = new Set([
  'walmart-hierarchy',
  'upload-upcs',
  'brands',
]);
const PRODUCT_MUTUALLY_EXCLUSIVE_OPTION_IDS = new Set<string>([
  'walmart-hierarchy',
  'upload-upcs',
  'juice-box',
  'brands',
]);
const STORE_MODAL_OPTION_IDS = new Set([
  'choose-from-walmart-stores',
  'upload-store-list',
  'choose-from-saved-groups',
]);

const CHOOSE_FROM_WALMART_STORES_ID = 'choose-from-walmart-stores';
const CHOOSE_FROM_SAVED_STORE_GROUPS_ID = 'choose-from-saved-groups';
const UPLOAD_STORE_LIST_ID = 'upload-store-list';
const ANY_WALMART_STORES_ID = 'any-walmart-stores';
const STORE_MUTUALLY_EXCLUSIVE_OPTION_IDS = new Set<string>([
  CHOOSE_FROM_WALMART_STORES_ID,
  UPLOAD_STORE_LIST_ID,
  CHOOSE_FROM_SAVED_STORE_GROUPS_ID,
  ANY_WALMART_STORES_ID,
]);
const STORE_SELECTIONS_SESSION_KEY =
  'survey-audience-query-builder-store-selections';

const EMPTY_ROW: QueryBuilderRowState = {
  id: 'condition-1',
};

function isQueryBuilderRowComplete(row: QueryBuilderRowState): boolean {
  if (!row.conditionId) {
    return false;
  }

  if (!PURCHASE_BEHAVIOR_CONDITION_IDS.has(row.conditionId)) {
    return true;
  }

  if (!row.productId || !row.purchaseChannelId || !row.dateId) {
    return false;
  }

  if (!STORE_REQUIRED_CHANNEL_IDS.has(row.purchaseChannelId)) {
    return true;
  }

  return Boolean(
    (row.selectedSavedStoreGroupIds?.length ?? 0) > 0 ||
    (row.selectedStoreIds?.length ?? 0) > 0 ||
    (row.storeId !== undefined &&
      STORE_MUTUALLY_EXCLUSIVE_OPTION_IDS.has(row.storeId)),
  );
}

function readSessionStoreSelections(): Record<string, string[]> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const rawValue = window.sessionStorage.getItem(
      STORE_SELECTIONS_SESSION_KEY,
    );

    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue) as unknown;

    if (!parsedValue || typeof parsedValue !== 'object') {
      return {};
    }

    return Object.entries(parsedValue as Record<string, unknown>).reduce<
      Record<string, string[]>
    >((accumulator, [rowId, selectedIds]) => {
      if (
        Array.isArray(selectedIds) &&
        selectedIds.every((selectedId) => typeof selectedId === 'string')
      ) {
        accumulator[rowId] = selectedIds;
      }

      return accumulator;
    }, {});
  } catch {
    return {};
  }
}

function QueryBuilderSelect({
  placeholder,
  value,
  options,
  selectedOptionId,
  onSelect,
  showSectionHeaders,
  showSearch,
  searchPlaceholder,
  isOpen,
  onOpenChange,
  width = 216,
  maxMenuItemWidth = '320px',
}: {
  placeholder: string;
  value?: string;
  options: SelectOption[];
  selectedOptionId?: string;
  onSelect: (optionId: string, option: SelectOption) => void;
  showSectionHeaders?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  width?: number;
  maxMenuItemWidth?: string;
}) {
  return (
    <div style={{ width, flex: `0 0 ${width}px` }}>
      <MenuSingleSelect
        UNSAFE_style={{ width: '100%' }}
        placeholder={placeholder}
        value={value}
        options={options}
        selectedOptionId={selectedOptionId}
        showSectionHeaders={showSectionHeaders}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        maxMenuItemWidth={maxMenuItemWidth}
        variant="default"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSelect={onSelect}
      />
    </div>
  );
}

function ChooseHealthConditionModal({
  isOpen,
  initialSelectedId,
  onApply,
  onClose,
}: {
  isOpen: boolean;
  initialSelectedId?: string;
  onApply: (id: string | undefined) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<string | undefined>(
    initialSelectedId,
  );

  React.useEffect(() => {
    if (isOpen) {
      setSelected(initialSelectedId);
      setSearch('');
    }
  }, [isOpen, initialSelectedId]);

  const filteredCategories = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return HEALTH_SUB_CONDITION_CATEGORIES;
    return HEALTH_SUB_CONDITION_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.toLowerCase().includes(q)),
    })).filter((cat) => cat.items.length > 0);
  }, [search]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select health condition"
      size="medium"
      actions={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <LDButton size="medium" variant="secondary" onClick={onClose}>
            Cancel
          </LDButton>
          <LDButton
            size="medium"
            variant="primary"
            disabled={selected === undefined}
            onClick={() => onApply(selected)}
          >
            Apply
          </LDButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 8,
            background: 'var(--ld-semantic-color-surface, #fff)',
          }}
        >
          <LDIcon.Search size="small" aria-hidden />
          <input
            type="text"
            placeholder="Search conditions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search health conditions"
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--ld-semantic-color-text, #2e2f32)',
              background: 'transparent',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div
          style={{
            maxHeight: 360,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {filteredCategories.length === 0 ? (
            <div
              style={{
                padding: '24px 0',
                textAlign: 'center',
                fontSize: 14,
                color: 'var(--ld-semantic-color-text-subtle, #515357)',
              }}
            >
              No results found
            </div>
          ) : (
            filteredCategories.map((cat, catIndex) => (
              <div key={cat.group}>
                {catIndex > 0 && (
                  <div
                    style={{
                      height: 1,
                      background: 'var(--ld-semantic-color-separator, #e3e4e5)',
                      margin: '8px 0',
                    }}
                  />
                )}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: '16px',
                    color: 'var(--ld-semantic-color-text-subtle, #515357)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 4,
                  }}
                >
                  {cat.group}
                </div>
                {cat.items.map((item) => (
                  <div key={item} style={{ padding: '4px 0' }}>
                    <Radio
                      name="health-sub-condition"
                      label={item}
                      value={item}
                      checked={selected === item}
                      onChange={() => setSelected(item)}
                    />
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}

function ConditionRow({
  row,
  canRemove,
  onUpdate,
  onRemove,
  onOpenFlow,
}: {
  row: QueryBuilderRowState;
  canRemove: boolean;
  onUpdate: (rowId: string, patch: Partial<QueryBuilderRowState>) => void;
  onRemove: (rowId: string) => void;
  onOpenFlow: (
    kind: QueryBuilderFlowKind,
    title: string,
    rowId: string,
  ) => void;
}) {
  const [isActionMenuOpen, setIsActionMenuOpen] = React.useState(false);
  const actionTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const [pendingFlow, setPendingFlow] = React.useState<{
    kind: QueryBuilderFlowKind;
    title: string;
    rowId: string;
  } | null>(null);
  const [pendingStoreReplacement, setPendingStoreReplacement] = React.useState<{
    optionId: string;
    optionLabel: string;
  } | null>(null);
  const [pendingProductReplacement, setPendingProductReplacement] =
    React.useState<{
      optionId: string;
      optionLabel: string;
    } | null>(null);

  React.useEffect(() => {
    if (!pendingFlow || openMenuId !== null) {
      return;
    }

    onOpenFlow(pendingFlow.kind, pendingFlow.title, pendingFlow.rowId);
    setPendingFlow(null);
  }, [openMenuId, onOpenFlow, pendingFlow]);

  const showConditionSelect = row.subjectConditionId === HEALTH_CONDITION_ID;
  const isPurchaseBehaviorCondition =
    row.conditionId !== undefined &&
    PURCHASE_BEHAVIOR_CONDITION_IDS.has(row.conditionId);
  const showHealthConditionSelect =
    row.conditionId === HEALTH_CONDITION_ID ||
    row.conditionId === 'are-in-health and wellness community';
  const showHealthTreatmentSelect =
    showHealthConditionSelect && Boolean(row.selectedHealthSubConditionId);
  const showProductSelect = isPurchaseBehaviorCondition;
  const showPurchaseChannelSelect = showProductSelect && Boolean(row.productId);
  const showStoreSelect =
    showPurchaseChannelSelect &&
    Boolean(row.purchaseChannelId) &&
    STORE_REQUIRED_CHANNEL_IDS.has(row.purchaseChannelId ?? '');
  const showDateSelect =
    showPurchaseChannelSelect && Boolean(row.purchaseChannelId);
  const selectedStoreCount = row.selectedStoreIds?.length ?? 0;
  const selectedSavedStoreGroupCount =
    row.selectedSavedStoreGroupIds?.length ?? 0;
  const selectedBrandCount = row.selectedBrandIds?.length ?? 0;

  const executeProductSelection = React.useCallback(
    (optionId: string) => {
      const nextProductId = row.productId === optionId ? undefined : optionId;

      onUpdate(row.id, {
        productId: nextProductId,
        purchaseChannelId: undefined,
        storeId: undefined,
        selectedStoreIds: undefined,
        selectedSavedStoreGroupIds: undefined,
        selectedBrandIds: undefined,
        dateId: undefined,
      });

      if (nextProductId && PRODUCT_MODAL_OPTION_IDS.has(nextProductId)) {
        setOpenMenuId(null);
        setPendingFlow({
          kind: nextProductId === 'brands' ? 'brands' : 'product',
          title:
            nextProductId === 'brands' ? 'Choose brands' : 'Select product',
          rowId: row.id,
        });
      }
    },
    [onUpdate, row.id, row.productId],
  );

  const executeStoreSelection = React.useCallback(
    (optionId: string) => {
      if (optionId === CHOOSE_FROM_WALMART_STORES_ID) {
        setOpenMenuId(null);
        setPendingFlow({
          kind: 'store',
          title: 'Select store',
          rowId: row.id,
        });
        return;
      }

      if (optionId === CHOOSE_FROM_SAVED_STORE_GROUPS_ID) {
        setOpenMenuId(null);
        setPendingFlow({
          kind: 'saved-store-groups',
          title: 'Choose from store groups',
          rowId: row.id,
        });
        return;
      }

      const nextStoreId = row.storeId === optionId ? undefined : optionId;
      onUpdate(row.id, {
        storeId: nextStoreId,
        selectedStoreIds: undefined,
        selectedSavedStoreGroupIds: undefined,
      });
    },
    [onUpdate, row.id, row.storeId],
  );

  const currentStoreSelectionTypeId =
    selectedSavedStoreGroupCount > 0
      ? CHOOSE_FROM_SAVED_STORE_GROUPS_ID
      : selectedStoreCount > 0
        ? CHOOSE_FROM_WALMART_STORES_ID
        : row.storeId;

  const hasAnyStoreSelection =
    selectedSavedStoreGroupCount > 0 ||
    selectedStoreCount > 0 ||
    (row.storeId !== undefined &&
      STORE_MUTUALLY_EXCLUSIVE_OPTION_IDS.has(row.storeId));

  return (
    <>
      <div
        style={{
          minWidth: 0,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 40,
        }}
      >
        <div
          style={{
            minWidth: 0,
            flex: 1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: '#2e2f32',
              lineHeight: '20px',
              width: 48,
              flex: '0 0 48px',
            }}
          >
            Who
          </div>

          <QueryBuilderSelect
            placeholder="Select condition"
            options={CONDITION_SELECT_OPTIONS}
            selectedOptionId={row.subjectConditionId}
            showSectionHeaders
            isOpen={openMenuId === 'subject-condition'}
            onOpenChange={(isOpen) =>
              setOpenMenuId(isOpen ? 'subject-condition' : null)
            }
            onSelect={(optionId, option) => {
              if (option.isHeader) return;
              const nextSubjectConditionId =
                row.subjectConditionId === optionId ? undefined : optionId;
              const leavingHealthCondition =
                nextSubjectConditionId !== HEALTH_CONDITION_ID;
              onUpdate(row.id, {
                subjectConditionId: nextSubjectConditionId,
                ...(leavingHealthCondition
                  ? {
                      conditionId: undefined,
                      productId: undefined,
                      purchaseChannelId: undefined,
                      storeId: undefined,
                      selectedStoreIds: undefined,
                      selectedSavedStoreGroupIds: undefined,
                      selectedBrandIds: undefined,
                      dateId: undefined,
                      selectedHealthSubConditionId: undefined,
                      healthTreatmentId: undefined,
                    }
                  : {}),
              });
            }}
          />

          {showConditionSelect ? (
            <>
              <div
                style={{
                  fontSize: 14,
                  color: '#2e2f32',
                  lineHeight: '20px',
                  flex: '0 0 auto',
                }}
              >
                and
              </div>

              <QueryBuilderSelect
                placeholder="Select condition"
                options={SUB_COMMUNITY_CONDITION_OPTIONS}
                selectedOptionId={row.conditionId}
                isOpen={openMenuId === 'condition'}
                onOpenChange={(isOpen) =>
                  setOpenMenuId(isOpen ? 'condition' : null)
                }
                onSelect={(optionId, option) => {
                  if (option.isHeader) {
                    return;
                  }

                  const nextConditionId =
                    row.conditionId === optionId ? undefined : optionId;
                  const currentBranch = row.conditionId
                    ? PURCHASE_BEHAVIOR_CONDITION_IDS.has(row.conditionId)
                      ? 'purchase'
                      : 'demographic'
                    : null;
                  const nextBranch = nextConditionId
                    ? PURCHASE_BEHAVIOR_CONDITION_IDS.has(nextConditionId)
                      ? 'purchase'
                      : 'demographic'
                    : null;

                  const shouldClearDownstream = currentBranch !== nextBranch;

                  onUpdate(row.id, {
                    conditionId: nextConditionId,
                    ...(shouldClearDownstream
                      ? {
                          productId: undefined,
                          purchaseChannelId: undefined,
                          storeId: undefined,
                          selectedStoreIds: undefined,
                          selectedSavedStoreGroupIds: undefined,
                          dateId: undefined,
                        }
                      : {}),
                    ...(nextConditionId !== HEALTH_CONDITION_ID &&
                    nextConditionId !== 'are-in-health and wellness community'
                      ? { selectedHealthSubConditionId: undefined, healthTreatmentId: undefined }
                      : {}),
                  });
                }}
              />
            </>
          ) : null}

          {showHealthConditionSelect ? (
            <>
              <div
                style={{
                  fontSize: 14,
                  color: '#2e2f32',
                  lineHeight: '20px',
                  flex: '0 0 auto',
                }}
              >
                for
              </div>
              <div style={{ flex: '0 0 auto' }}>
                <button
                  type="button"
                  onClick={() => setOpenMenuId('health-sub-condition')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    width: 216,
                    height: 32,
                    padding: '3px 11px',
                    background: '#ededed',
                    border: '2px solid #2e2f32',
                    borderRadius: 4,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    color: '#2e2f32',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: row.selectedHealthSubConditionId ? '#2e2f32' : '#74767c',
                    }}
                  >
                    {row.selectedHealthSubConditionId ?? 'Select condition (optional)'}
                  </span>
                  <LDIcon.ChevronDown size="small" aria-hidden />
                </button>
              </div>
              {openMenuId === 'health-sub-condition' && (
                <ChooseHealthConditionModal
                  isOpen
                  initialSelectedId={row.selectedHealthSubConditionId}
                  onApply={(id) => {
                    setOpenMenuId(null);
                    onUpdate(row.id, {
                      selectedHealthSubConditionId: id,
                      healthTreatmentId: undefined,
                    });
                  }}
                  onClose={() => setOpenMenuId(null)}
                />
              )}
            </>
          ) : null}

          {showHealthTreatmentSelect ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flex: '0 0 auto',
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: '#2e2f32',
                    lineHeight: '20px',
                  }}
                >
                  and
                </div>
                <QueryBuilderSelect
                  placeholder="Select prescription filter (optional)"
                  width={120}
                  maxMenuItemWidth="480px"
                  options={HEALTH_TREATMENT_OPTIONS}
                  selectedOptionId={row.healthTreatmentId}
                  isOpen={openMenuId === 'health-treatment'}
                  onOpenChange={(isOpen) =>
                    setOpenMenuId(isOpen ? 'health-treatment' : null)
                  }
                  onSelect={(optionId, option) => {
                    if (option.isHeader) return;
                    const nextId =
                      row.healthTreatmentId === optionId ? undefined : optionId;
                    onUpdate(row.id, { healthTreatmentId: nextId });
                  }}
                />
              </div>
            </>
          ) : null}

          {showProductSelect ? (
            <QueryBuilderSelect
              placeholder="Select product"
              value={
                row.productId === 'brands' && selectedBrandCount > 0
                  ? `${selectedBrandCount} brand${selectedBrandCount === 1 ? '' : 's'}`
                  : undefined
              }
              options={PRODUCT_SELECT_OPTIONS}
              selectedOptionId={row.productId}
              showSectionHeaders
              isOpen={openMenuId === 'product'}
              onOpenChange={(isOpen) =>
                setOpenMenuId(isOpen ? 'product' : null)
              }
              onSelect={(optionId, option) => {
                if (option.isHeader) {
                  return;
                }

                const isMutuallyExclusiveTarget =
                  PRODUCT_MUTUALLY_EXCLUSIVE_OPTION_IDS.has(optionId);
                const hasAnyProductSelection = row.productId !== undefined;
                const isSelectionTypeChange =
                  row.productId !== undefined && row.productId !== optionId;

                if (
                  isMutuallyExclusiveTarget &&
                  hasAnyProductSelection &&
                  isSelectionTypeChange
                ) {
                  setOpenMenuId(null);
                  setPendingProductReplacement({
                    optionId,
                    optionLabel: option.label,
                  });
                  return;
                }

                executeProductSelection(optionId);
              }}
            />
          ) : null}

          {showPurchaseChannelSelect ? (
            <QueryBuilderSelect
              placeholder="Select purchase channel"
              options={PURCHASE_CHANNEL_OPTIONS}
              selectedOptionId={row.purchaseChannelId}
              isOpen={openMenuId === 'channel'}
              onOpenChange={(isOpen) =>
                setOpenMenuId(isOpen ? 'channel' : null)
              }
              onSelect={(optionId, option) => {
                if (option.isHeader) {
                  return;
                }

                const nextPurchaseChannelId =
                  row.purchaseChannelId === optionId ? undefined : optionId;
                onUpdate(row.id, {
                  purchaseChannelId: nextPurchaseChannelId,
                  storeId: undefined,
                  selectedStoreIds: undefined,
                  selectedSavedStoreGroupIds: undefined,
                  selectedBrandIds: undefined,
                  dateId: undefined,
                });
              }}
            />
          ) : null}

          {showStoreSelect ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div
                style={{
                  fontSize: 14,
                  color: '#2e2f32',
                  lineHeight: '20px',
                  flex: '0 0 auto',
                }}
              >
                at
              </div>

              <QueryBuilderSelect
                placeholder="Any Walmart store"
                value={
                  selectedSavedStoreGroupCount > 0
                    ? `${selectedSavedStoreGroupCount} store group${
                        selectedSavedStoreGroupCount === 1 ? '' : 's'
                      }`
                    : selectedStoreCount > 0
                      ? `${selectedStoreCount} Walmart store${
                          selectedStoreCount === 1 ? '' : 's'
                        }`
                      : undefined
                }
                options={STORE_SELECT_OPTIONS}
                selectedOptionId={
                  selectedSavedStoreGroupCount > 0
                    ? CHOOSE_FROM_SAVED_STORE_GROUPS_ID
                    : selectedStoreCount > 0
                      ? CHOOSE_FROM_WALMART_STORES_ID
                      : (row.storeId ?? ANY_WALMART_STORES_ID)
                }
                showSectionHeaders
                isOpen={openMenuId === 'store'}
                onOpenChange={(isOpen) =>
                  setOpenMenuId(isOpen ? 'store' : null)
                }
                onSelect={(optionId, option) => {
                  if (option.isHeader) {
                    return;
                  }

                  const isMutuallyExclusiveTarget =
                    STORE_MUTUALLY_EXCLUSIVE_OPTION_IDS.has(optionId);
                  const isSelectionTypeChange =
                    currentStoreSelectionTypeId !== undefined &&
                    currentStoreSelectionTypeId !== optionId;

                  if (
                    isMutuallyExclusiveTarget &&
                    hasAnyStoreSelection &&
                    isSelectionTypeChange
                  ) {
                    setOpenMenuId(null);
                    setPendingStoreReplacement({
                      optionId,
                      optionLabel: option.label,
                    });
                    return;
                  }

                  executeStoreSelection(optionId);
                }}
              />
            </div>
          ) : null}

          {showDateSelect ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div
                style={{
                  fontSize: 14,
                  color: '#2e2f32',
                  lineHeight: '20px',
                  flex: '0 0 48px',
                  width: 48,
                }}
              >
                during
              </div>

              <QueryBuilderSelect
                placeholder="Select date"
                options={DATE_SELECT_OPTIONS}
                selectedOptionId={row.dateId}
                isOpen={openMenuId === 'date'}
                onOpenChange={(isOpen) => setOpenMenuId(isOpen ? 'date' : null)}
                onSelect={(optionId, option) => {
                  if (option.isHeader) {
                    return;
                  }

                  if (optionId === 'date-range') {
                    setOpenMenuId(null);
                    setPendingFlow({
                      kind: 'date',
                      title: 'Select date range',
                      rowId: row.id,
                    });
                    return;
                  }

                  const nextDateId =
                    row.dateId === optionId ? undefined : optionId;
                  onUpdate(row.id, {
                    dateId: nextDateId,
                  });
                }}
              />
            </div>
          ) : null}
        </div>

        <MenuAction
          isOpen={isActionMenuOpen}
          onClose={() => setIsActionMenuOpen(false)}
          onOpen={() => setIsActionMenuOpen(true)}
          position="bottomRight"
          zIndex={600}
          trigger={
            <LDIconButton
              ref={actionTriggerRef}
              a11yLabel={canRemove ? 'Condition actions' : 'Clear condition'}
              size="small"
              variant="secondary"
              onClick={() => setIsActionMenuOpen((previous) => !previous)}
            >
              <LDIcon.More size="small" aria-hidden />
            </LDIconButton>
          }
          triggerRef={actionTriggerRef as React.RefObject<HTMLElement>}
        >
          <DvMenuItem
            variant="destructive"
            leadingIcon={<LDIcon.Trash size="small" aria-hidden />}
            onClick={() => {
              if (canRemove) {
                onRemove(row.id);
              } else {
                onUpdate(row.id, {
                  subjectConditionId: undefined,
                  conditionId: undefined,
                  productId: undefined,
                  purchaseChannelId: undefined,
                  storeId: undefined,
                  selectedStoreIds: undefined,
                  selectedSavedStoreGroupIds: undefined,
                  selectedBrandIds: undefined,
                  dateId: undefined,
                  selectedHealthSubConditionId: undefined,
                  healthTreatmentId: undefined,
                });
              }
              setIsActionMenuOpen(false);
            }}
          >
            {canRemove ? 'Delete' : 'Clear'}
          </DvMenuItem>
        </MenuAction>
      </div>

      {pendingProductReplacement ? (
        <Modal
          isOpen
          onClose={() => setPendingProductReplacement(null)}
          title="Replace selection"
          size="small"
          actions={
            <div style={{ display: 'flex', gap: 12 }}>
              <LDButton
                variant="secondary"
                onClick={() => setPendingProductReplacement(null)}
              >
                Cancel
              </LDButton>
              <LDButton
                variant="primary"
                onClick={() => {
                  const { optionId } = pendingProductReplacement;

                  setPendingProductReplacement(null);
                  executeProductSelection(optionId);
                }}
              >
                Replace
              </LDButton>
            </div>
          }
        >
          <div style={{ textAlign: 'left', width: '100%' }}>
            Are you sure you want to choose a different method of product
            selection? This action will replace your current selections.
          </div>
        </Modal>
      ) : null}

      {pendingStoreReplacement ? (
        <Modal
          isOpen
          onClose={() => setPendingStoreReplacement(null)}
          title="Replace selection"
          size="small"
          actions={
            <div style={{ display: 'flex', gap: 12 }}>
              <LDButton
                variant="secondary"
                onClick={() => setPendingStoreReplacement(null)}
              >
                Cancel
              </LDButton>
              <LDButton
                variant="primary"
                onClick={() => {
                  const { optionId } = pendingStoreReplacement;

                  onUpdate(row.id, {
                    storeId: undefined,
                    selectedStoreIds: undefined,
                    selectedSavedStoreGroupIds: undefined,
                    selectedBrandIds: undefined,
                  });

                  setPendingStoreReplacement(null);
                  executeStoreSelection(optionId);
                }}
              >
                Replace
              </LDButton>
            </div>
          }
        >
          <div style={{ textAlign: 'left', width: '100%' }}>
            Are you sure you want to choose a different method of Walmart store
            selection? This action will replace your current selections.
          </div>
        </Modal>
      ) : null}
    </>
  );
}

export function SurveyAudienceQueryBuilder({
  isEnabled,
  onFlowModalOpenChange,
  onQueryCompleteChange,
}: {
  isEnabled: boolean;
  onFlowModalOpenChange?: (isOpen: boolean) => void;
  onQueryCompleteChange?: (isComplete: boolean) => void;
}) {
  const [rows, setRows] = React.useState<QueryBuilderRowState[]>(() => {
    const storedSelections = readSessionStoreSelections();
    const selectedStoreIds = storedSelections[EMPTY_ROW.id];

    return [
      {
        ...EMPTY_ROW,
        selectedStoreIds:
          selectedStoreIds && selectedStoreIds.length > 0
            ? selectedStoreIds
            : undefined,
      },
    ];
  });
  const [flowModal, setFlowModal] = React.useState<QueryBuilderFlowState>(null);
  const [queryConnector, setQueryConnector] =
    React.useState<QueryConnector>('or');
  const nextRowIdRef = React.useRef(2);

  React.useEffect(() => {
    onFlowModalOpenChange?.(flowModal !== null);
  }, [flowModal, onFlowModalOpenChange]);

  React.useEffect(() => {
    if (!isEnabled) {
      onQueryCompleteChange?.(false);
      return;
    }

    onQueryCompleteChange?.(
      rows.length > 0 && rows.every((row) => isQueryBuilderRowComplete(row)),
    );
  }, [isEnabled, onQueryCompleteChange, rows]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const sessionSelections = rows.reduce<Record<string, string[]>>(
      (accumulator, row) => {
        if (row.selectedStoreIds && row.selectedStoreIds.length > 0) {
          accumulator[row.id] = row.selectedStoreIds;
        }

        return accumulator;
      },
      {},
    );

    if (Object.keys(sessionSelections).length === 0) {
      window.sessionStorage.removeItem(STORE_SELECTIONS_SESSION_KEY);
      return;
    }

    window.sessionStorage.setItem(
      STORE_SELECTIONS_SESSION_KEY,
      JSON.stringify(sessionSelections),
    );
  }, [rows]);

  const openFlow = React.useCallback(
    (kind: QueryBuilderFlowKind, title: string, rowId: string) => {
      setFlowModal({ kind, title, rowId });
    },
    [],
  );

  const updateRow = React.useCallback(
    (rowId: string, patch: Partial<QueryBuilderRowState>) => {
      setRows((previousRows) =>
        previousRows.map((row) =>
          row.id === rowId ? { ...row, ...patch } : row,
        ),
      );
    },
    [],
  );

  const removeRow = React.useCallback((rowId: string) => {
    setRows((previousRows) => {
      if (previousRows.length === 1) {
        return [{ ...EMPTY_ROW, id: rowId }];
      }

      return previousRows.filter((row) => row.id !== rowId);
    });
  }, []);

  const addRow = React.useCallback(() => {
    setRows((previousRows) => [
      ...previousRows,
      { id: `condition-${nextRowIdRef.current++}` },
    ]);
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      style={{
        border: '1px solid #e3e4e5',
        borderRadius: 8,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 400,
          color: '#74767c',
          lineHeight: '20px',
        }}
      >
        All of the following conditions are true
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {rows.map((row, index) => (
          <React.Fragment key={row.id}>
            {index > 0 ? (
              <div
                style={{
                  paddingLeft: 0,
                }}
              >
                {index === 1 ? (
                  <div style={{ width: 62 }}>
                    <LDSelect
                      options={QUERY_CONNECTOR_OPTIONS}
                      onChange={(option) => {
                        if (option === 'or' || option === 'and') {
                          setQueryConnector(option);
                        }
                      }}
                      size="small"
                      value={queryConnector}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 62,
                      height: 32,
                      border: '1px solid #909196',
                      borderRadius: 4,
                      padding: '0 8px',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#2e2f32',
                      fontSize: 14,
                      lineHeight: '20px',
                      background: '#fff',
                    }}
                  >
                    {queryConnector}
                  </div>
                )}
              </div>
            ) : null}

            <ConditionRow
              row={row}
              canRemove={rows.length > 1}
              onUpdate={updateRow}
              onRemove={removeRow}
              onOpenFlow={openFlow}
            />
          </React.Fragment>
        ))}
      </div>

      <div style={{ alignSelf: 'flex-start' }}>
        <LinkButton
          size="small"
          leading={<LDIcon.Plus size="small" aria-hidden />}
          onClick={addRow}
        >
          New condition
        </LinkButton>
      </div>

      {flowModal?.kind === 'store' ? (
        <ChooseWalmartStoresModal
          isOpen
          initialSelectedStoreIds={
            rows.find((row) => row.id === flowModal.rowId)?.selectedStoreIds
          }
          onApply={(selectedStoreIds) => {
            updateRow(flowModal.rowId, {
              storeId: undefined,
              selectedStoreIds,
            });
            setFlowModal(null);
          }}
          onClose={() => setFlowModal(null)}
        />
      ) : flowModal?.kind === 'saved-store-groups' ? (
        <ChooseSavedStoreGroupsModal
          isOpen
          initialSelectedGroupIds={
            rows.find((row) => row.id === flowModal.rowId)
              ?.selectedSavedStoreGroupIds
          }
          onApply={(selectedSavedStoreGroupIds) => {
            updateRow(flowModal.rowId, {
              storeId: CHOOSE_FROM_SAVED_STORE_GROUPS_ID,
              selectedStoreIds: undefined,
              selectedSavedStoreGroupIds,
            });
            setFlowModal(null);
          }}
          onClose={() => setFlowModal(null)}
        />
      ) : flowModal?.kind === 'brands' ? (
        <ChooseBrandsModal
          isOpen
          initialSelectedBrandIds={
            rows.find((row) => row.id === flowModal.rowId)?.selectedBrandIds
          }
          onApply={(selectedBrandIds: string[]) => {
            updateRow(flowModal.rowId, {
              productId: 'brands',
              purchaseChannelId: undefined,
              storeId: undefined,
              selectedStoreIds: undefined,
              selectedSavedStoreGroupIds: undefined,
              selectedBrandIds:
                selectedBrandIds.length > 0 ? selectedBrandIds : undefined,
              dateId: undefined,
            });
            setFlowModal(null);
          }}
          onClose={() => setFlowModal(null)}
        />
      ) : (
        <SurveyAudienceFlowModal
          isOpen={flowModal !== null}
          title={flowModal?.title ?? ''}
          onClose={() => setFlowModal(null)}
        />
      )}
    </div>
  );
}

export default SurveyAudienceQueryBuilder;
