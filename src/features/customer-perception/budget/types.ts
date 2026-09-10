export type ContractYearStatus = 'active' | 'expired' | 'upcoming';

export type ContractYear = {
  id: string;
  label: string;
  status: ContractYearStatus;
  startDate: string;
  endDate: string;
};

export type BudgetSummary = {
  totalBudget: number;
  spentAmount: number;
  committedAmount: number;
  remainingBalance: number;
  availableBalance: number;
  assignedUsersCount: number;
  validThroughLabel?: string;
};

export type CostCenterBudgetRow = {
  id: string;
  name: string;
  budget: number;
  spent: number;
  committed: number;
  available: number;
  assignedUsers: string[];
  additionalUsers: number;
  isOverspent?: boolean;
  billedSeparately: number;
  allUsers?: boolean;
};

export type BudgetActivityRow = {
  id: string;
  details: string;
  costCenterId: string;
  costCenterName: string;
  amount: number;
  date: string;
  contractYearId: string;
};

export type CustomerPerceptionBudgetOverviewData = {
  contractYearId: string;
  summary: BudgetSummary;
  costCenters: CostCenterBudgetRow[];
  activity: BudgetActivityRow[];
};

export type PurchaseOrderRow = {
  id: string;
  name: string;
  poNumber: string;
  budget: number;
  spent: number;
  committed: number;
  available: number;
  billedSeparately: number;
  useByDate: string;
  previousUseByDate?: string;
  isOverspent?: boolean;
};

export type AvatarTone = 'blue' | 'green' | 'yellow' | 'pink' | 'purple';

export type AssignedUserRow = {
  id: string;
  name: string;
  email: string;
  lastUpdated: string;
  initials: string;
  avatarTone: AvatarTone;
};

export type SurveyType = 'work-order' | 'discover';

export type SurveyActivityRow = {
  id: string;
  surveyName: string;
  surveyType: SurveyType;
  creatorName: string;
  creatorInitials: string;
  poNumber: string;
  lastUpdated: string;
  projectCost: number;
  billableCost: number;
  discount: number;
  researchService: number;
  totalCost: number;
};

export type CostCenterDetailData = {
  id: string;
  costCenterName: string;
  contractYearId: string;
  summary: BudgetSummary;
  purchaseOrders: PurchaseOrderRow[];
  assignedUsers: AssignedUserRow[];
  recentSurveyActivity: SurveyActivityRow[];
};

export type CustomerPerceptionBudgetMockData = {
  contractYears: ContractYear[];
  overviewByContractYear: Record<string, CustomerPerceptionBudgetOverviewData>;
  detailsByCostCenterId: Record<string, CostCenterDetailData>;
};
