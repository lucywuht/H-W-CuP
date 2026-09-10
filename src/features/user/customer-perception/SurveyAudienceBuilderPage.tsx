import * as React from 'react';
import { Button as LDKitButton } from '../../../components/Button';
import { Image } from '../../../components/Image';
import { Checkbox } from '../../../components/Checkbox';
import { Tag } from '../../../components/Tag';
import { SnackbarProvider, useSnackbar } from '../../../components/Snackbar';
import {
  Alert,
  Button as LDButton,
  ChoiceCard,
  DvIconSave,
  IconButton as LDIconButton,
  LDIcon,
  Link as DvLink,
  LuminateSelect,
  MenuSingleSelect,
  Modal,
  OverlayHeader,
  TabNavigation,
  TabNavigationItem,
  TextField,
} from '@walmart-dataventures/shared-components';

import { AudienceModeChoiceCard } from '../../../components/customer-perception/AudienceModeChoiceCard';
import { SHARED_PURCHASE_ORDER_OPTIONS } from '../../customer-perception/shared/purchaseOrderOptions';
import { SurveyAudienceQueryBuilder } from './SurveyAudienceQueryBuilder';
import quotasIllustration from '../../../assets/illustrations/AESAssociate_Main-CrWYDx8J.svg';
import customAudienceIllustration from '../../../assets/illustrations/ProductGroup_Various_.svg';
import generalPopulationIllustration from '../../../assets/illustrations/Gen-pop.svg';

type RespondentPreset = 200 | 500 | 1000;
type AudienceMode = 'general' | 'custom';
type BuilderTab =
  | 'audience'
  | 'survey-questions'
  | 'data-enrichment'
  | 'summary';

interface CensusDemographic {
  category: string;
  populationPercent: number;
}

interface CensusCategory {
  name: string;
  demographics: CensusDemographic[];
}

interface SurveyAudienceBuilderPageProps {
  projectName: string;
  onBack: () => void;
}

const CENSUS_DATA: CensusCategory[] = [
  {
    name: 'Gender',
    demographics: [
      { category: 'Male', populationPercent: 49.5 },
      { category: 'Female', populationPercent: 50.5 },
    ],
  },
  {
    name: 'Age',
    demographics: [
      { category: '18-24', populationPercent: 9.5 },
      { category: '25-34', populationPercent: 13.7 },
      { category: '35-44', populationPercent: 13.2 },
      { category: '45-54', populationPercent: 13.1 },
      { category: '55-64', populationPercent: 12.9 },
      { category: '65+', populationPercent: 16.8 },
    ],
  },
  {
    name: 'Region',
    demographics: [
      { category: 'Northeast', populationPercent: 17.1 },
      { category: 'Midwest', populationPercent: 21.0 },
      { category: 'South', populationPercent: 38.1 },
      { category: 'West', populationPercent: 23.8 },
    ],
  },
  {
    name: 'Ethnicity',
    demographics: [
      { category: 'White', populationPercent: 60.1 },
      { category: 'Hispanic', populationPercent: 18.5 },
      { category: 'Black', populationPercent: 12.6 },
      { category: 'Asian', populationPercent: 5.9 },
      { category: 'Other', populationPercent: 2.9 },
    ],
  },
];

const PRESETS: Array<{
  value: RespondentPreset;
  title: string;
  caption: string;
}> = [
  {
    value: 200,
    title: '200 customers',
    caption: 'Confident read. Good for comparing small groups',
  },
  {
    value: 500,
    title: '500 customers',
    caption: 'Solid insights. Reliable for clear overall results',
  },
  {
    value: 1000,
    title: '1,000 customers',
    caption: 'Broad view. Gives a strong nationwide perspective',
  },
];

type SummaryLogicRow = {
  logic: string;
  attribution: React.ReactNode;
};

const SUMMARY_AUDIENCE_SELECTION_ROWS: SummaryLogicRow[] = [
  {
    logic: '',
    attribution: (
      <>
        <div>
          Who purchased food in stores and online during last 6 month in Store
          #XYZ123
        </div>
        <div style={{ fontWeight: 700 }}>[ and ]</div>
        <div>Who purchased consumables in stores and online last 6 month</div>
      </>
    ),
  },
  {
    logic: '[ and ]',
    attribution: 'Who are any of education level = employed/partially employed',
  },
  {
    logic: '[ or ]',
    attribution: 'Who are any of baby expectancy =Yes',
  },
];

const SUMMARY_PRIOR_PARTICIPATION_ROWS: SummaryLogicRow[] = [
  {
    logic: '',
    attribution: 'Include who were invited for project XYZ',
  },
  {
    logic: '[ and ]',
    attribution: 'Include who were invited for project XYZ',
  },
];

const GENERAL_AUDIENCE_ILLUSTRATION: React.ReactNode = (
  <Image
    src={generalPopulationIllustration}
    alt="Illustration of a broad general population audience"
    UNSAFE_style={{ height: 60, width: 'auto', maxWidth: '100%' }}
  />
);

const CUSTOM_AUDIENCE_ILLUSTRATION: React.ReactNode = (
  <Image
    src={customAudienceIllustration}
    alt="Illustration of a targeted custom audience"
    UNSAFE_style={{ height: 60, width: 'auto', maxWidth: '100%' }}
  />
);

const QUOTAS_SECTION_ILLUSTRATION: React.ReactNode = (
  <Image
    src={quotasIllustration}
    alt="Illustration representing survey quota controls"
    UNSAFE_style={{ width: '100%', height: 'auto', maxWidth: 140 }}
  />
);

interface EnrichmentVariable {
  id: string;
  variable: string;
  values: string[];
}

const ENRICHMENT_VARIABLES: EnrichmentVariable[] = [
  {
    id: 'age-range',
    variable: 'Age range',
    values: ['18-24', '25-34', '35-44', '45-54', '55-74', '75+'],
  },
  {
    id: 'children-under-18',
    variable: 'Children under 18',
    values: ['Yes', 'No'],
  },
  {
    id: 'gender',
    variable: 'Gender',
    values: ['Male', 'Female', 'Other'],
  },
  {
    id: 'hispanic-or-latino',
    variable: 'Hispanic or Latino',
    values: ['Yes', 'No', 'Prefer not to answer'],
  },
  {
    id: 'race',
    variable: 'Race',
    values: [
      'Caucasian / White',
      'African / African-American',
      'Asian',
      'Indigenous Peoples',
      'Other',
      'Prefer not to answer',
    ],
  },
  {
    id: 'region',
    variable: 'Region',
    values: ['Northeast', 'Midwest', 'South', 'West'],
  },
];

interface HealthConditionCategory {
  group: string;
  items: string[];
}

const HEALTH_CONDITION_CATEGORIES: HealthConditionCategory[] = [
  {
    group: 'Allergies & Respiratory',
    items: [
      'Allergies (Severe)',
      'Asthma',
      'Chronic Obstructive Pulmonary Disease (COPD)',
      'Cystic fibrosis',
      'Seasonal Allergy',
    ],
  },
  {
    group: 'Cancer',
    items: ['Cancer'],
  },
  {
    group: 'Cardiovascular & Metabolic',
    items: [
      'Cardiovascular Disease',
      'Chronic Kidney Disease (CKD)',
      'High Cholesterol',
      'Hypertension/ High Blood Pressure',
      'Insulin resistant / prediabetes',
      'Obesity or weight-related issues',
      'Type 1 Diabetes',
      'Type 2 Diabetes',
    ],
  },
  {
    group: 'Dermatology',
    items: [
      'Acne',
      'Alopecia',
      'Eczema/ Atopic Dermatitis',
      'Hair loss/ Baldness',
      'Psoriasis',
    ],
  },
  {
    group: 'Digestive & GI',
    items: [
      'Acid Reflux (GERD)',
      "Crohn's Disease",
      'Inflammatory Bowel Disease (IBD)',
      'Irritable Bowel Syndrome (IBS)',
      'Ulcerative Collitis',
    ],
  },
  {
    group: 'Eyes',
    items: ['Diabetic Retinopathy', 'Glaucoma', 'Wet AMD'],
  },
  {
    group: 'Infectious & Immune',
    items: [
      'Hemophilia',
      'Hepatitis (B/C)',
      'Hepatitis C',
      'HIV/AIDS',
      'Lupus',
    ],
  },
  {
    group: 'Mental Health & Neurological',
    items: [
      'ADD / ADHD',
      "Alzheimer's Disease and Dementia",
      'Anxiety',
      'Bipolar Disorder I & II',
      'Depression',
      'Epilepsy',
      "Huntington's Disease",
      'Migraine',
      'Multiple Sclerosis',
      'Obsessive Compulsive Disorder (OCD)',
      'Other Psychiatric disorder SPECIFY',
      "Parkinson's Disease",
      'Schizophrenia',
      'Tardive Dyskinesia',
    ],
  },
  {
    group: 'Musculoskeletal',
    items: [
      'Ankylosing Spondylitis',
      'Fibromyalgia',
      'Gout',
      'Osteoarthritis',
      'Osteoporosis',
      'Psoriatic Arthritis',
      'Rheumatoid Arthritis',
    ],
  },
  {
    group: 'Pain & Sleep',
    items: ['Chronic Pain', 'Insomnia', 'Sleep Apnea'],
  },
  {
    group: 'Reproductive & Hormonal',
    items: [
      'Endometriosis',
      'Erectile Dysfunction',
      'Menopause/ Perimenopause',
      'Polycystic Ovary Syndrome (PCOS)',
      'Thyroid Disease',
    ],
  },
  {
    group: 'Urological',
    items: ['Overactive Bladder'],
  },
];

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SummarySectionHeader({
  title,
  iconLabel,
  icon,
}: {
  title: string;
  iconLabel: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 'var(--ld-semantic-font-body-medium-size, 16px)',
          lineHeight: 'var(--ld-semantic-font-body-medium-lineheight, 24px)',
          fontWeight: 700,
          color: 'var(--ld-semantic-color-text, #2e2f32)',
        }}
      >
        {title}
      </div>
      <LDIconButton a11yLabel={iconLabel} size="small" variant="secondary">
        {icon}
      </LDIconButton>
    </div>
  );
}

function SummaryLogicTable({ rows }: { rows: SummaryLogicRow[] }) {
  return (
    <div
      style={{
        border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: 140,
            padding: '10px 12px',
            background: 'var(--ld-semantic-color-background-subtle, #f8f8f8)',
            fontSize: 14,
            lineHeight: '20px',
            fontWeight: 700,
            color: 'var(--ld-semantic-color-text, #2e2f32)',
          }}
        >
          Group logic
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: '10px 12px',
            background: 'var(--ld-semantic-color-background-subtle, #f8f8f8)',
            fontSize: 14,
            lineHeight: '20px',
            fontWeight: 700,
            color: 'var(--ld-semantic-color-text, #2e2f32)',
          }}
        >
          Attribution
        </div>
      </div>
      {rows.map((row, index) => (
        <div
          key={`${row.logic}-${index}`}
          style={{
            display: 'flex',
            borderTop: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
          }}
        >
          <div
            style={{
              width: 140,
              padding: '10px 12px',
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--ld-semantic-color-text, #2e2f32)',
              fontWeight: 700,
              whiteSpace: 'pre-wrap',
            }}
          >
            {row.logic || '\u200B'}
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              padding: '10px 12px',
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--ld-semantic-color-text, #2e2f32)',
            }}
          >
            {row.attribution}
          </div>
        </div>
      ))}
    </div>
  );
}

function EnrichmentOptionRow({
  label,
  Icon,
  onClick,
}: {
  label: string;
  Icon: React.ComponentType<{
    size?: 'small' | 'medium' | 'large';
    'aria-hidden'?: boolean;
  }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        background: 'var(--ld-semantic-color-surface, #fff)',
        border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
        borderRadius: 8,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <Icon size="medium" aria-hidden />
      <span
        style={{
          flex: '1 1 auto',
          fontWeight: 700,
          fontSize: 16,
          lineHeight: '24px',
          color: 'var(--ld-semantic-color-text, #2e2f32)',
        }}
      >
        {label}
      </span>
      <LDIcon.ChevronRight size="small" aria-hidden />
    </button>
  );
}

function SurveyAudienceBuilderPageContent({
  projectName,
  onBack,
}: SurveyAudienceBuilderPageProps) {
  const { addSnack } = useSnackbar();
  const [customRespondents, setCustomRespondents] = React.useState<string>('');
  const [isAudienceQueryComplete, setIsAudienceQueryComplete] =
    React.useState(false);
  const [audienceMode, setAudienceMode] = React.useState<AudienceMode | null>(
    null,
  );
  const [isAudienceInfoVisible, setIsAudienceInfoVisible] =
    React.useState<boolean>(true);
  const [isCensusDistributionVisible, setIsCensusDistributionVisible] =
    React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<BuilderTab>('audience');
  const [isAddEnrichmentModalOpen, setIsAddEnrichmentModalOpen] =
    React.useState(false);
  const [enrichmentModalView, setEnrichmentModalView] = React.useState<
    'picker' | 'health-condition'
  >('picker');
  const [healthConditionSearch, setHealthConditionSearch] = React.useState('');
  const [selectedHealthConditions, setSelectedHealthConditions] = React.useState<
    Set<string>
  >(new Set());
  const [addedHealthConditions, setAddedHealthConditions] = React.useState<string[]>([]);

  const filteredHealthCategories = React.useMemo(() => {
    const q = healthConditionSearch.trim().toLowerCase();
    if (!q) return HEALTH_CONDITION_CATEGORIES;
    return HEALTH_CONDITION_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.toLowerCase().includes(q)),
    })).filter((cat) => cat.items.length > 0);
  }, [healthConditionSearch]);

  const handleEnrichmentModalClose = React.useCallback(() => {
    setIsAddEnrichmentModalOpen(false);
    setEnrichmentModalView('picker');
    setHealthConditionSearch('');
    setSelectedHealthConditions(new Set());
  }, []);

  const handleHealthConditionToggle = React.useCallback((item: string) => {
    setSelectedHealthConditions((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }, []);
  const [isFlowModalOpen, setIsFlowModalOpen] = React.useState(false);
  const [isPurchaseOrderConfirmModalOpen, setIsPurchaseOrderConfirmModalOpen] =
    React.useState(false);
  const [
    isOverlayCloseTemporarilyDisabled,
    setIsOverlayCloseTemporarilyDisabled,
  ] = React.useState(false);
  const overlayCloseEnableTimerRef = React.useRef<number | null>(null);

  const handleFlowModalOpenChange = React.useCallback((isOpen: boolean) => {
    setIsFlowModalOpen(isOpen);

    if (typeof window === 'undefined') {
      return;
    }

    if (overlayCloseEnableTimerRef.current !== null) {
      window.clearTimeout(overlayCloseEnableTimerRef.current);
      overlayCloseEnableTimerRef.current = null;
    }

    if (isOpen) {
      setIsOverlayCloseTemporarilyDisabled(true);
      return;
    }

    setIsOverlayCloseTemporarilyDisabled(true);
    overlayCloseEnableTimerRef.current = window.setTimeout(() => {
      setIsOverlayCloseTemporarilyDisabled(false);
      overlayCloseEnableTimerRef.current = null;
    }, 400);
  }, []);

  React.useEffect(() => {
    return () => {
      if (
        overlayCloseEnableTimerRef.current !== null &&
        typeof window !== 'undefined'
      ) {
        window.clearTimeout(overlayCloseEnableTimerRef.current);
      }
    };
  }, []);

  const handleOverlayClose = React.useCallback(() => {
    if (
      isFlowModalOpen ||
      isPurchaseOrderConfirmModalOpen ||
      isOverlayCloseTemporarilyDisabled
    ) {
      return;
    }

    onBack();
  }, [
    isFlowModalOpen,
    isPurchaseOrderConfirmModalOpen,
    isOverlayCloseTemporarilyDisabled,
    onBack,
  ]);

  const selectedPreset = React.useMemo<RespondentPreset | null>(() => {
    const parsed = Number(customRespondents.trim());

    if (!Number.isFinite(parsed)) {
      return null;
    }

    if (parsed === 200 || parsed === 500 || parsed === 1000) {
      return parsed;
    }

    return null;
  }, [customRespondents]);

  const requestedCompletes = React.useMemo(() => {
    const parsed = Number(customRespondents);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
  }, [customRespondents]);

  const costPerComplete = 4;
  const totalCost = requestedCompletes * costPerComplete;
  const isAudienceTab = activeTab === 'audience';
  const isSummaryTab = activeTab === 'summary';
  const isDataEnrichmentTab = activeTab === 'data-enrichment';
  const [isEnrichmentSidebarExpanded, setIsEnrichmentSidebarExpanded] =
    React.useState(true);
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = React.useState<
    string | undefined
  >(undefined);
  const [billingConfirmed, setBillingConfirmed] = React.useState(false);
  const purchaseOrderOptions = React.useMemo(
    () =>
      SHARED_PURCHASE_ORDER_OPTIONS.map((option) => ({
        id: option.id,
        label: option.label,
      })),
    [],
  );
  const selectedPurchaseOrder = React.useMemo(
    () =>
      SHARED_PURCHASE_ORDER_OPTIONS.find(
        (option) => option.id === selectedPurchaseOrderId,
      ),
    [selectedPurchaseOrderId],
  );
  const hasUnconfirmedPurchaseOrderChange = Boolean(
    selectedPurchaseOrderId && !billingConfirmed,
  );
  const primaryCtaLabel = React.useMemo(() => {
    if (activeTab === 'audience') {
      return 'Go to survey questions';
    }

    if (activeTab === 'survey-questions') {
      return 'Go to Data enrichment';
    }

    if (activeTab === 'data-enrichment') {
      return 'Go to summary';
    }

    return 'Submit survey';
  }, [activeTab]);

  const handlePrimaryCtaClick = React.useCallback(() => {
    if (activeTab === 'audience') {
      setActiveTab('survey-questions');
      return;
    }

    if (activeTab === 'survey-questions') {
      setActiveTab('data-enrichment');
      return;
    }

    if (activeTab === 'data-enrichment') {
      setActiveTab('summary');
      return;
    }

    if (hasUnconfirmedPurchaseOrderChange) {
      setIsPurchaseOrderConfirmModalOpen(true);
      return;
    }

    addSnack({ message: 'Survey submitted' });
  }, [activeTab, addSnack, hasUnconfirmedPurchaseOrderChange]);
  const summaryMockCost = 6500;
  const isBudgetShort = Boolean(
    selectedPurchaseOrder &&
    selectedPurchaseOrder.availableBalance < summaryMockCost,
  );
  const balanceCovered = selectedPurchaseOrder
    ? Math.min(selectedPurchaseOrder.availableBalance, summaryMockCost)
    : 0;
  const invoicedSeparately = selectedPurchaseOrder
    ? Math.max(summaryMockCost - selectedPurchaseOrder.availableBalance, 0)
    : 0;

  return (
    <div
      style={{
        background: 'var(--ld-semantic-color-background-subtle, #f8f8f8)',
      }}
    >
      <OverlayHeader
        UNSAFE_style={{
          background: 'var(--ld-semantic-color-surface, #ffffff)',
          borderBottom: 'none',
        }}
        config={{
          titleConfig: {
            title: projectName,
          },
        }}
        onTitleClose={
          isFlowModalOpen ||
          isPurchaseOrderConfirmModalOpen ||
          isOverlayCloseTemporarilyDisabled
            ? undefined
            : handleOverlayClose
        }
        TopRightHeaderPrimary={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DvIconSave size={16} aria-hidden />
            <span
              style={{
                fontSize: 14,
                lineHeight: '20px',
                color: 'var(--ld-semantic-color-text-subtlest, #74767c)',
              }}
            >
              Autosaved
            </span>
            <LDButton size="medium" variant="secondary" disabled>
              Preview
            </LDButton>
            <LDButton
              size="medium"
              variant="primary"
              onClick={handlePrimaryCtaClick}
            >
              {primaryCtaLabel}
            </LDButton>
          </div>
        }
        TopRightHeaderSecondary={
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <LDIconButton a11yLabel="Help" size="medium" variant="secondary">
              <LDIcon.QuestionCircle size="small" aria-hidden />
            </LDIconButton>
            <LDIconButton
              a11yLabel="More options"
              size="medium"
              variant="secondary"
            >
              <LDIcon.More size="small" aria-hidden />
            </LDIconButton>
          </div>
        }
      >
        <TabNavigation
          UNSAFE_style={{
            width: '100%',
            background: 'var(--ld-semantic-color-surface, #ffffff)',
          }}
        >
          <TabNavigationItem
            href="#"
            isCurrent={activeTab === 'audience'}
            onClick={(event) => {
              event.preventDefault();
              setActiveTab('audience');
            }}
          >
            Audience
          </TabNavigationItem>
          <TabNavigationItem
            href="#"
            isCurrent={activeTab === 'survey-questions'}
            onClick={(event) => {
              event.preventDefault();
              setActiveTab('survey-questions');
            }}
          >
            Survey questions
          </TabNavigationItem>
          <TabNavigationItem
            href="#"
            isCurrent={activeTab === 'data-enrichment'}
            onClick={(event) => {
              event.preventDefault();
              setActiveTab('data-enrichment');
            }}
          >
            Data enrichment
          </TabNavigationItem>
          <TabNavigationItem
            href="#"
            isCurrent={activeTab === 'summary'}
            onClick={(event) => {
              event.preventDefault();
              setActiveTab('summary');
            }}
          >
            Summary
          </TabNavigationItem>
        </TabNavigation>
      </OverlayHeader>

      <Modal
        isOpen={isPurchaseOrderConfirmModalOpen}
        onClose={() => setIsPurchaseOrderConfirmModalOpen(false)}
        title="Confirm purchase order change"
        size="small"
        actions={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <LDButton
              size="medium"
              variant="primary"
              onClick={() => setIsPurchaseOrderConfirmModalOpen(false)}
            >
              OK
            </LDButton>
          </div>
        }
      >
        <div
          style={{
            fontSize: 14,
            lineHeight: '20px',
            color: 'var(--ld-semantic-color-text, #2e2f32)',
          }}
        >
          You have updated the Purchase order that will be charged for this
          survey, please select update billing before Submitting the survey.
        </div>
      </Modal>

      <Modal
        isOpen={isAddEnrichmentModalOpen}
        onClose={handleEnrichmentModalClose}
        title={
          enrichmentModalView === 'health-condition'
            ? 'Add from health condition'
            : 'Add enrichment from'
        }
        onBack={
          enrichmentModalView === 'health-condition'
            ? () => setEnrichmentModalView('picker')
            : undefined
        }
        size={enrichmentModalView === 'health-condition' ? 'medium' : 'small'}
        actions={
          enrichmentModalView === 'health-condition' ? (
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}
            >
              <LDButton
                size="medium"
                variant="secondary"
                onClick={handleEnrichmentModalClose}
              >
                Cancel
              </LDButton>
              <LDButton
                size="medium"
                variant="primary"
                disabled={selectedHealthConditions.size === 0}
                onClick={() => {
                  setAddedHealthConditions((prev) => {
                    const next = [...prev];
                    for (const item of selectedHealthConditions) {
                      if (!next.includes(item)) next.push(item);
                    }
                    return next;
                  });
                  handleEnrichmentModalClose();
                }}
              >
                Add
              </LDButton>
            </div>
          ) : undefined
        }
      >
        {enrichmentModalView === 'picker' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              {
                id: 'demographic',
                label: 'Demographic & household',
                Icon: LDIcon.Users,
                onClick: () => setIsAddEnrichmentModalOpen(false),
              },
              {
                id: 'walmart-hierarchy',
                label: 'Walmart hierarchy',
                Icon: LDIcon.Grid,
                onClick: () => setIsAddEnrichmentModalOpen(false),
              },
              {
                id: 'health-condition',
                label: 'Health condition',
                Icon: LDIcon.Heart,
                onClick: () => setEnrichmentModalView('health-condition'),
              },
            ].map(({ id, label, Icon, onClick }) => (
              <EnrichmentOptionRow
                key={id}
                label={label}
                Icon={Icon}
                onClick={onClick}
              />
            ))}
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                border:
                  '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                borderRadius: 8,
                background: 'var(--ld-semantic-color-surface, #fff)',
              }}
            >
              <LDIcon.Search size="small" aria-hidden />
              <input
                type="text"
                placeholder="Search"
                value={healthConditionSearch}
                onChange={(e) => setHealthConditionSearch(e.target.value)}
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
              {filteredHealthCategories.length === 0 ? (
                <div
                  style={{
                    padding: '24px 0',
                    textAlign: 'center',
                    fontSize: 14,
                    color:
                      'var(--ld-semantic-color-text-subtle, #515357)',
                  }}
                >
                  No results found
                </div>
              ) : (
                filteredHealthCategories.map((cat, catIndex) => (
                  <div key={cat.group}>
                    {catIndex > 0 && (
                      <div
                        style={{
                          height: 1,
                          background:
                            'var(--ld-semantic-color-separator, #e3e4e5)',
                          margin: '8px 0',
                        }}
                      />
                    )}
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: '16px',
                        color:
                          'var(--ld-semantic-color-text-subtle, #515357)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 4,
                      }}
                    >
                      {cat.group}
                    </div>
                    {cat.items.map((item) => (
                      <div
                        key={item}
                        style={{ padding: '4px 0' }}
                      >
                        <Checkbox
                          label={item}
                          checked={selectedHealthConditions.has(item)}
                          onChange={() =>
                            handleHealthConditionToggle(item)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Modal>

      <div
        style={{
          display: 'flex',
          gap: 24,
          padding: 24,
          alignItems: 'flex-start',
        }}
      >
        <main
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {isSummaryTab ? (
            <>
              <section
                style={{
                  background: 'var(--ld-semantic-color-surface, #fff)',
                  border:
                    '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                  borderRadius: 8,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <SummarySectionHeader
                  title="Survey details"
                  iconLabel="Edit survey details"
                  icon={<LDIcon.Pencil size="small" aria-hidden />}
                />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: '20px',
                        fontWeight: 700,
                        color: '#2e2f32',
                      }}
                    >
                      Survey name
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: '20px',
                        color: '#2e2f32',
                      }}
                    >
                      Tomato Ketchup Package Test
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: '20px',
                        fontWeight: 700,
                        color: '#2e2f32',
                      }}
                    >
                      Targeted completes
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: '20px',
                        color: '#2e2f32',
                      }}
                    >
                      100
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: '20px',
                      fontWeight: 700,
                      color: '#2e2f32',
                    }}
                  >
                    Survey objective
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: '20px',
                      color: '#2e2f32',
                    }}
                  >
                    Placeholder survey objective Placeholder survey objective
                    Placeholder survey objective
                  </div>
                </div>
              </section>

              <section
                style={{
                  background: 'var(--ld-semantic-color-surface, #fff)',
                  border:
                    '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                  borderRadius: 8,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <SummarySectionHeader
                  title="Audience"
                  iconLabel="Edit audience"
                  icon={<LDIcon.Pencil size="small" aria-hidden />}
                />

                <div
                  style={{
                    fontSize: 14,
                    lineHeight: '20px',
                    fontWeight: 700,
                    color: '#2e2f32',
                  }}
                >
                  Audience selection
                </div>
                <SummaryLogicTable rows={SUMMARY_AUDIENCE_SELECTION_ROWS} />

                <div
                  style={{
                    fontSize: 14,
                    lineHeight: '20px',
                    fontWeight: 700,
                    color: '#2e2f32',
                    marginTop: 4,
                  }}
                >
                  Filter by prior participation
                </div>
                <SummaryLogicTable rows={SUMMARY_PRIOR_PARTICIPATION_ROWS} />
              </section>
            </>
          ) : isDataEnrichmentTab ? (
            <section
              style={{
                background: 'var(--ld-semantic-color-surface, #fff)',
                border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      lineHeight: '24px',
                      color: 'var(--ld-semantic-color-text, #2e2f32)',
                      marginBottom: 4,
                    }}
                  >
                    Data enrichment
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: '20px',
                      color: 'var(--ld-semantic-color-text-subtle, #515357)',
                    }}
                  >
                    Enrichment variables let you segment your results data,
                    providing more detailed insights
                  </div>
                </div>
                <LDButton
                  size="medium"
                  variant="secondary"
                  onClick={() => setIsAddEnrichmentModalOpen(true)}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <LDIcon.Plus size="small" aria-hidden />
                    Add enrichment
                  </span>
                </LDButton>
              </div>

              <div
                style={{
                  border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '220px 140px 1fr 40px',
                    padding: '10px 16px',
                    background: 'var(--ld-semantic-color-background-subtle, #f8f8f8)',
                    borderBottom: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                  }}
                >
                  {(['Enrichment variable', 'Type', 'Value', ''] as const).map((h) => (
                    <span
                      key={h}
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: '20px',
                        color: 'var(--ld-semantic-color-text, #2e2f32)',
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Add on rows — health conditions */}
                {addedHealthConditions.map((condition) => (
                  <div
                    key={condition}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '220px 140px 1fr 40px',
                      padding: '14px 16px',
                      borderBottom: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: '20px',
                        color: 'var(--ld-semantic-color-text, #2e2f32)',
                      }}
                    >
                      {condition}
                    </span>
                    <span>
                      <Tag color="yellow" size="small" variant="tertiary">
                        Add on
                      </Tag>
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: '20px',
                        color: 'var(--ld-semantic-color-text, #2e2f32)',
                      }}
                    >
                      Yes, No
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                      <LDIconButton
                        a11yLabel={`Remove ${condition}`}
                        size="small"
                        variant="secondary"
                        onClick={() =>
                          setAddedHealthConditions((prev) =>
                            prev.filter((c) => c !== condition),
                          )
                        }
                      >
                        <LDIcon.Close size="small" aria-hidden />
                      </LDIconButton>
                    </span>
                  </div>
                ))}

                {/* Included rows — static enrichment variables */}
                {ENRICHMENT_VARIABLES.map((row, index) => (
                  <div
                    key={row.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '220px 140px 1fr 40px',
                      padding: '14px 16px',
                      borderBottom:
                        index < ENRICHMENT_VARIABLES.length - 1
                          ? '1px solid var(--ld-semantic-color-separator, #e3e4e5)'
                          : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: '20px',
                        color: 'var(--ld-semantic-color-text, #2e2f32)',
                      }}
                    >
                      {row.variable}
                    </span>
                    <span>
                      <Tag color="gray" size="small" variant="tertiary">
                        Included
                      </Tag>
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: '20px',
                        color: 'var(--ld-semantic-color-text, #2e2f32)',
                      }}
                    >
                      {row.values.join(', ')}
                    </span>
                    <span />
                  </div>
                ))}
              </div>
            </section>
          ) : !isAudienceTab ? (
            <section
              style={{
                background: 'var(--ld-semantic-color-surface, #fff)',
                border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                borderRadius: 8,
                minHeight: 640,
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  lineHeight: '24px',
                  fontWeight: 700,
                  color: 'var(--ld-semantic-color-text, #2e2f32)',
                }}
              >
                Survey question coming soon
              </div>
            </section>
          ) : (
            <>
              <section
                style={{
                  background: 'var(--ld-semantic-color-surface, #fff)',
                  border:
                    '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                  borderRadius: 8,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--ld-semantic-font-body-medium-size, 16px)',
                    lineHeight:
                      'var(--ld-semantic-font-body-medium-lineheight, 24px)',
                    fontWeight: 700,
                    color: 'var(--ld-semantic-color-text, #2e2f32)',
                  }}
                >
                  How many respondents would you like to hear from?
                </div>
                <div
                  style={{
                    marginTop: 4,
                    color: '#74767c',
                    fontSize: 14,
                    lineHeight: '20px',
                  }}
                >
                  Select a preset group size or enter a custom number
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                  {PRESETS.map((preset) => {
                    return (
                      <ChoiceCard
                        key={preset.value}
                        inputType="radio"
                        name="respondent-presets"
                        label={preset.title}
                        checked={selectedPreset === preset.value}
                        onChange={() =>
                          setCustomRespondents(String(preset.value))
                        }
                        bodyContent={
                          <div
                            style={{
                              color: '#74767c',
                              fontSize: 12,
                              lineHeight: '16px',
                              marginLeft: 28,
                            }}
                          >
                            {preset.caption}
                          </div>
                        }
                        width={220}
                      />
                    );
                  })}
                </div>

                <div style={{ marginTop: 16, maxWidth: 250 }}>
                  <TextField
                    label="Add a custom number of respondents"
                    type="text"
                    value={customRespondents}
                    onChange={(event) =>
                      setCustomRespondents(
                        event.target.value.replace(/\D/g, ''),
                      )
                    }
                    placeholder="Enter a number"
                    textFieldProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    size="large"
                  />
                </div>
              </section>

              <section
                style={{
                  background: 'var(--ld-semantic-color-surface, #fff)',
                  border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                  borderRadius: 8,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#2e2f32',
                      lineHeight: '24px',
                      marginBottom: 4,
                    }}
                  >
                    Who do you want to speak with?
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: '#74767c',
                      lineHeight: '20px',
                    }}
                  >
                    Choose the criteria that decide who gets invited to your
                    survey.{' '}
                    <DvLink
                      href="#"
                      onClick={(event) => event.preventDefault()}
                    >
                      Learn more about audience selection
                    </DvLink>
                  </div>
                </div>

                {isAudienceInfoVisible ? (
                  <Alert
                    variant="info"
                    showCloseButton
                    onClose={() => setIsAudienceInfoVisible(false)}
                  >
                    Did you know? All responses come from real, verified Walmart
                    shoppers that are active members of our Spark Community.
                  </Alert>
                ) : null}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 16,
                  }}
                >
                  <AudienceModeChoiceCard
                    checked={audienceMode === 'general'}
                    description="Hear from a broad group reflecting current U.S. Census demographics"
                    illustration={GENERAL_AUDIENCE_ILLUSTRATION}
                    name="audience-mode"
                    onChange={() => setAudienceMode('general')}
                    title="General population"
                  />

                  <AudienceModeChoiceCard
                    checked={audienceMode === 'custom'}
                    description="Target verified shoppers by purchase behavior or demographics"
                    illustration={CUSTOM_AUDIENCE_ILLUSTRATION}
                    name="audience-mode"
                    onChange={() => setAudienceMode('custom')}
                    title="Custom audience"
                  />
                </div>

                {audienceMode === 'general' ? (
                  <div
                    style={{
                      background: 'var(--ld-semantic-color-surface, #fff)',
                      border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                      borderRadius: 8,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
                        lineHeight:
                          'var(--ld-semantic-font-body-small-lineheight, 20px)',
                        fontWeight: 700,
                        color: 'var(--ld-semantic-color-text, #2e2f32)',
                      }}
                    >
                      General population sample applied
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
                        lineHeight:
                          'var(--ld-semantic-font-body-small-lineheight, 20px)',
                        color: 'var(--ld-semantic-color-text, #2e2f32)',
                      }}
                    >
                      Your survey will collect responses to reflect U.S. Census
                      proportions within the Walmart Spark community. General
                      population includes preset distribution to match gender,
                      age, region and ethnicity as per the U.S. Census (2020)
                    </div>
                    <DvLink
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setIsCensusDistributionVisible(
                          !isCensusDistributionVisible,
                        );
                      }}
                    >
                      {isCensusDistributionVisible
                        ? 'Hide applied U.S census distribution'
                        : 'View applied U.S census distribution'}
                    </DvLink>

                    {isCensusDistributionVisible && (
                      <div
                        style={{
                          marginTop: 16,
                          border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        {CENSUS_DATA.map((category, categoryIndex) => (
                          <div key={category.name}>
                            {/* Category Header */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor:
                                  'var(--ld-semantic-color-surface-subtle, #f8f8f8)',
                                borderBottom:
                                  '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                                height: '40px',
                                paddingLeft: '16px',
                                paddingRight: '16px',
                              }}
                            >
                              <div
                                style={{
                                  width: '240px',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color:
                                    'var(--ld-semantic-color-text, #2e2f32)',
                                }}
                              >
                                {category.name}
                              </div>
                              <div
                                style={{
                                  width: '120px',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color:
                                    'var(--ld-semantic-color-text, #2e2f32)',
                                  textAlign: 'right',
                                }}
                              >
                                Population %
                              </div>
                              <div
                                style={{
                                  width: '120px',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color:
                                    'var(--ld-semantic-color-text, #2e2f32)',
                                  textAlign: 'right',
                                }}
                              >
                                Calculated #
                              </div>
                              <div style={{ flex: 1 }} />
                            </div>

                            {/* Data Rows */}
                            {category.demographics.map(
                              (demographic, rowIndex) => {
                                const respondentCount = Number(
                                  customRespondents.trim(),
                                );
                                const calculatedCount =
                                  Math.round(
                                    (demographic.populationPercent / 100) *
                                      respondentCount,
                                  ) || 0;

                                return (
                                  <div
                                    key={demographic.category}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      borderBottom:
                                        rowIndex <
                                        category.demographics.length - 1
                                          ? '1px solid var(--ld-semantic-color-separator, #e3e4e5)'
                                          : '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
                                      height: '40px',
                                      paddingLeft: '16px',
                                      paddingRight: '16px',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '240px',
                                        fontSize: '14px',
                                        fontWeight: '400',
                                        color:
                                          'var(--ld-semantic-color-text, #2e2f32)',
                                      }}
                                    >
                                      {demographic.category}
                                    </div>
                                    <div
                                      style={{
                                        width: '120px',
                                        fontSize: '14px',
                                        fontWeight: '400',
                                        color:
                                          'var(--ld-semantic-color-text, #2e2f32)',
                                        textAlign: 'right',
                                        fontFamily:
                                          'var(--ld-semantic-font-body-mono-small-family, "Courier New", monospace)',
                                      }}
                                    >
                                      {demographic.populationPercent}%
                                    </div>
                                    <div
                                      style={{
                                        width: '120px',
                                        fontSize: '14px',
                                        fontWeight: '400',
                                        color:
                                          'var(--ld-semantic-color-text, #2e2f32)',
                                        textAlign: 'right',
                                        fontFamily:
                                          'var(--ld-semantic-font-body-mono-small-family, "Courier New", monospace)',
                                      }}
                                    >
                                      {calculatedCount}
                                    </div>
                                    <div style={{ flex: 1 }} />
                                  </div>
                                );
                              },
                            )}

                            {/* Category Footer Spacing */}
                            {categoryIndex < CENSUS_DATA.length - 1 && (
                              <div
                                style={{
                                  height: '8px',
                                  backgroundColor:
                                    'var(--ld-semantic-color-surface, #fff)',
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                <SurveyAudienceQueryBuilder
                  isEnabled={audienceMode === 'custom'}
                  onFlowModalOpenChange={handleFlowModalOpenChange}
                  onQueryCompleteChange={setIsAudienceQueryComplete}
                />
                {audienceMode === 'custom' && isAudienceQueryComplete ? (
                  <div style={{ alignSelf: 'flex-start' }}>
                    <LDButton
                      size="small"
                      variant="tertiary"
                      leading={<LDIcon.Plus size="small" aria-hidden />}
                      onClick={() => {
                        // Handle new audience group logic
                      }}
                    >
                      New audience group
                    </LDButton>
                  </div>
                ) : null}
              </section>

              <section
                style={{
                  background: '#fff',
                  border: '1px solid #e3e4e5',
                  borderRadius: 8,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--ld-semantic-font-body-medium-size, 16px)',
                    lineHeight:
                      'var(--ld-semantic-font-body-medium-lineheight, 24px)',
                    fontWeight: 700,
                    color: 'var(--ld-semantic-color-text, #2e2f32)',
                  }}
                >
                  Surveys are distributed automatically by default. Want more
                  control with quotas?
                </div>
                <div
                  style={{
                    background:
                      'var(--ld-semantic-color-fill-info-subtle, #e9f1fe)',
                    borderRadius: 8,
                    padding: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      width: 140,
                      flex: '0 0 140px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {QUOTAS_SECTION_ILLUSTRATION}
                  </div>
                  <div
                    style={{
                      flex: '1 1 420px',
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: 280,
                      color: 'var(--ld-semantic-color-text, #2e2f32)',
                      fontSize:
                        'var(--ld-semantic-font-body-small-size, 14px)',
                      lineHeight:
                        'var(--ld-semantic-font-body-small-lineheight, 20px)',
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>
                        Quotas help you compare opinions between groups like
                        men and women or different ages
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        <li>
                          Helpful for more nuanced comparison but not necessary
                          for every survey
                        </li>
                        <li>Work best for surveys with 100+ respondents</li>
                        <li>
                          May adjust your audience&apos;s natural mix to hit
                          selected quotas
                        </li>
                      </ul>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        gap: 12,
                        flexWrap: 'wrap',
                      }}
                    >
                      <LDButton
                        size="small"
                        variant="primary"
                        disabled
                        leading={<LDIcon.Plus size="small" aria-hidden />}
                      >
                        Set quotas to control distribution
                      </LDButton>
                      <DvLink
                        href="#"
                        onClick={(event) => event.preventDefault()}
                      >
                        Learn more about quotas
                      </DvLink>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>

        {isAudienceTab ? (
          <aside
            style={{
              width: 336,
              flex: '0 0 336px',
              background: 'var(--ld-semantic-color-surface, #fff)',
              borderRadius: 8,
              boxShadow:
                '0px -1px 2px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.15)',
              padding: 16,
              border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  fontSize: 'var(--ld-semantic-font-heading-medium-size, 20px)',
                  lineHeight:
                    'var(--ld-semantic-font-heading-medium-lineheight, 28px)',
                  fontWeight: 600,
                  color: '#2e2f32',
                }}
              >
                ${totalCost.toLocaleString()}.00
              </div>
              <div
                style={{ color: '#74767c', fontSize: 14, lineHeight: '20px' }}
              >
                Invoicing will be based on qualified completes at survey
                closure, capped at requested amount
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#2e2f32',
                }}
              >
                <span>Number of completes</span>
                <strong>{requestedCompletes}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#2e2f32',
                }}
              >
                <span>Cost per complete</span>
                <strong>${costPerComplete}.00</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#2e2f32',
                }}
              >
                <span>Data enrichment cost</span>
                <strong>$00.00</strong>
              </div>
            </div>
          </aside>
        ) : isDataEnrichmentTab ? (
          <aside
            style={{
              width: 336,
              flex: '0 0 336px',
              background: 'var(--ld-semantic-color-surface, #fff)',
              borderRadius: 8,
              boxShadow:
                '0px -1px 2px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.15)',
              padding: 16,
              border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 'var(--ld-semantic-font-heading-medium-size, 20px)',
                  lineHeight:
                    'var(--ld-semantic-font-heading-medium-lineheight, 28px)',
                  fontWeight: 600,
                  color: '#2e2f32',
                }}
              >
                $0.00
              </div>
              <LDIconButton
                a11yLabel={
                  isEnrichmentSidebarExpanded
                    ? 'Collapse cost summary'
                    : 'Expand cost summary'
                }
                size="small"
                variant="secondary"
                onClick={() =>
                  setIsEnrichmentSidebarExpanded((v) => !v)
                }
              >
                <LDIcon.ChevronDown
                  size="small"
                  aria-hidden
                  style={{
                    transform: isEnrichmentSidebarExpanded
                      ? 'rotate(180deg)'
                      : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </LDIconButton>
            </div>

            {isEnrichmentSidebarExpanded && (
              <>
                <div
                  style={{
                    color: '#74767c',
                    fontSize: 14,
                    lineHeight: '20px',
                  }}
                >
                  Invoicing will be based on qualified completes at survey
                  closure, capped at requested amount
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      lineHeight: '20px',
                      color: '#2e2f32',
                    }}
                  >
                    <span>Number of completes</span>
                    <strong>0</strong>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 14,
                      lineHeight: '20px',
                      color: '#2e2f32',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      Cost per complete
                      <LDIcon.InfoCircle size="small" aria-hidden />
                    </span>
                    <strong>$5.50</strong>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      lineHeight: '20px',
                      color: '#2e2f32',
                    }}
                  >
                    <span>Data enrichment cost</span>
                    <strong>$0.00</strong>
                  </div>
                </div>
              </>
            )}
          </aside>
        ) : isSummaryTab ? (
          <aside
            style={{
              width: 336,
              flex: '0 0 336px',
              background: 'var(--ld-semantic-color-surface, #fff)',
              borderRadius: 8,
              boxShadow:
                '0px -1px 2px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.15)',
              padding: 16,
              border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  fontSize: 'var(--ld-semantic-font-heading-medium-size, 20px)',
                  lineHeight:
                    'var(--ld-semantic-font-heading-medium-lineheight, 28px)',
                  fontWeight: 600,
                  color: '#2e2f32',
                }}
              >
                $6,500.00
              </div>
              <div
                style={{ color: '#74767c', fontSize: 14, lineHeight: '20px' }}
              >
                Invoicing will be based on qualified completes at survey
                closure, capped at requested amount
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#2e2f32',
                }}
              >
                <span>Number of completes</span>
                <strong>190</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#2e2f32',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Cost per complete
                  <LDIcon.InfoCircle size="small" aria-hidden />
                </span>
                <strong>$4.00</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#2e2f32',
                }}
              >
                <span>Data enrichment cost</span>
                <strong>$0.00</strong>
              </div>
            </div>

            <div
              style={{
                height: 1,
                background: 'var(--ld-semantic-color-separator, #e3e4e5)',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: '20px',
                    fontWeight: 700,
                    color: '#2e2f32',
                  }}
                >
                  Bill to
                </div>
                <div
                  style={{ fontSize: 12, lineHeight: '16px', color: '#74767c' }}
                >
                  Choose purchase order that will be charged for this survey
                </div>
              </div>

              <LuminateSelect
                label="Purchase order"
                options={purchaseOrderOptions.map((o) => ({
                  key: o.id,
                  label: o.label,
                }))}
                value={selectedPurchaseOrderId ?? ''}
                onChange={(id) => {
                  setBillingConfirmed(false);
                  setSelectedPurchaseOrderId(id || undefined);
                }}
                isFullWidth
                size="small"
                placeholder="Select an option"
                scrollableDivId="purchaseOrderMenuList"
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    lineHeight: '20px',
                    color: '#2e2f32',
                  }}
                >
                  <span>Cost center</span>
                  <strong style={{ textAlign: 'right' }}>
                    {selectedPurchaseOrder?.costCenter ??
                      'Pepsi.co Scintilla fund'}
                  </strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    lineHeight: '20px',
                    color: '#2e2f32',
                  }}
                >
                  <span>Available balance</span>
                  <strong>
                    {selectedPurchaseOrder
                      ? formatCurrency(selectedPurchaseOrder.availableBalance)
                      : '--'}
                  </strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    lineHeight: '20px',
                    color: '#2e2f32',
                  }}
                >
                  <span>Valid through</span>
                  <strong>
                    {selectedPurchaseOrder?.validThrough ?? '--'}
                  </strong>
                </div>
              </div>

              {isBudgetShort && !billingConfirmed ? (
                <Alert variant="info" showCloseButton={false}>
                  You can still submit the survey as planned. Available balance
                  will cover {formatCurrency(balanceCovered)}{' '}
                  {formatCurrency(invoicedSeparately)} will be invoiced
                  separately
                </Alert>
              ) : null}

              {selectedPurchaseOrderId && !billingConfirmed ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <LDKitButton
                    size="small"
                    variant="tertiary"
                    isFullWidth
                    onClick={() => setSelectedPurchaseOrderId(undefined)}
                  >
                    Cancel
                  </LDKitButton>
                  <LDKitButton
                    size="small"
                    variant="secondary"
                    isFullWidth
                    onClick={() => {
                      setBillingConfirmed(true);
                      addSnack({
                        message:
                          'The survey will be billed to the updated Purchase order',
                      });
                    }}
                  >
                    Update billing
                  </LDKitButton>
                </div>
              ) : null}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

export function SurveyAudienceBuilderPage(
  props: SurveyAudienceBuilderPageProps,
) {
  return (
    <SnackbarProvider>
      <SurveyAudienceBuilderPageContent {...props} />
    </SnackbarProvider>
  );
}

export default SurveyAudienceBuilderPage;
