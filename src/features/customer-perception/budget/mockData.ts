import type {
  AssignedUserRow,
  BudgetActivityRow,
  BudgetSummary,
  ContractYear,
  CostCenterBudgetRow,
  CostCenterDetailData,
  CustomerPerceptionBudgetMockData,
  CustomerPerceptionBudgetOverviewData,
  PurchaseOrderRow,
  SurveyActivityRow,
} from './types';

const contractYears: ContractYear[] = [
  {
    id: 'year-2-active',
    label: 'Year 2 - active contract',
    status: 'active',
    startDate: '2025-05-14',
    endDate: '2026-08-13',
  },
  {
    id: 'year-1-closed',
    label: 'Year 1 - closed contract',
    status: 'expired',
    startDate: '2024-05-14',
    endDate: '2025-05-13',
  },
];

const activeCostCenters: CostCenterBudgetRow[] = [
  {
    id: 'cc-sparkling-water',
    name: 'Pepsi.co Scintilla fund - 1234567864',
    budget: 65000,
    spent: 50000,
    committed: 8000,
    available: 7000,
    assignedUsers: ['D', 'L', 'S', 'J'],
    additionalUsers: 9,
    billedSeparately: 0,
  },
  {
    id: 'cc-bottling',
    name: 'Pepsi.co bottling department fund - 23432534',
    budget: 65000,
    spent: 48000,
    committed: 10000,
    available: 7000,
    assignedUsers: ['D', 'L', 'S', 'J'],
    additionalUsers: 11,
    billedSeparately: 0,
  },
  {
    id: 'cc-marketing',
    name: 'Pepsi.co marketing campaign fund - 3456789123',
    budget: 65000,
    spent: 52000,
    committed: 12000,
    available: 1000,
    assignedUsers: ['D', 'L', 'S', 'J'],
    additionalUsers: 5,
    billedSeparately: 5000,
    isOverspent: true,
  },
  {
    id: 'cc-sustainability',
    name: 'Pepsi.co sustainability initiative fund - 4567891234',
    budget: 65000,
    spent: 55000,
    committed: 7500,
    available: 2500,
    assignedUsers: ['D', 'L', 'S', 'J'],
    additionalUsers: 3,
    billedSeparately: 0,
  },
  {
    id: 'cc-others',
    name: 'Others (budget outside of any cost center)',
    budget: 75000,
    spent: 70000,
    committed: 5000,
    available: 0,
    assignedUsers: [],
    additionalUsers: 0,
    billedSeparately: 3750,
    allUsers: true,
    isOverspent: false,
  },
];

const activeBudgetActivity: BudgetActivityRow[] = [
  {
    id: 'act-1',
    details: 'Funds added to PO- 9876543211',
    costCenterId: 'cc-sparkling-water',
    costCenterName: 'PepsiCo Eco-Friendly Packaging Initiative - 9876543211',
    amount: 2750,
    date: '06-15-2025',
    contractYearId: 'year-2-active',
  },
  {
    id: 'act-2',
    details: 'Funds added to PO- 9876543212',
    costCenterId: 'cc-bottling',
    costCenterName: 'PepsiCo Water Conservation Project - 9876543212',
    amount: 5500,
    date: '07-02-2025',
    contractYearId: 'year-2-active',
  },
  {
    id: 'act-3',
    details: 'Funds added to PO- 9876543213',
    costCenterId: 'cc-marketing',
    costCenterName: 'PepsiCo Renewable Energy Investment - 9876543213',
    amount: 4800,
    date: '07-20-2025',
    contractYearId: 'year-2-active',
  },
  {
    id: 'act-4',
    details: 'Funds added to PO- 9876543214',
    costCenterId: 'cc-sustainability',
    costCenterName: 'PepsiCo Community Recycling Program - 9876543214',
    amount: 1650,
    date: '08-05-2025',
    contractYearId: 'year-2-active',
  },
  {
    id: 'act-5',
    details: 'Funds added to PO- 9876543215',
    costCenterId: 'cc-sparkling-water',
    costCenterName: 'PepsiCo Healthy Living Initiative - 9876543215',
    amount: 2100,
    date: '08-18-2025',
    contractYearId: 'year-2-active',
  },
  {
    id: 'act-6',
    details: 'Funds added to PO- 9876543216',
    costCenterId: 'cc-bottling',
    costCenterName: 'PepsiCo Education and Youth Engagement Fund - 9876543216',
    amount: 3000,
    date: '09-01-2025',
    contractYearId: 'year-2-active',
  },
  {
    id: 'act-7',
    details: 'Funds added to PO- 9876543217',
    costCenterId: 'cc-marketing',
    costCenterName: 'PepsiCo Global Hunger Relief Fund - 9876543217',
    amount: 4000,
    date: '09-15-2025',
    contractYearId: 'year-2-active',
  },
  {
    id: 'act-8',
    details: 'Funds added to PO- 9876543218',
    costCenterId: 'cc-sustainability',
    costCenterName: 'PepsiCo Sports for Development Program - 9876543218',
    amount: 2500,
    date: '10-01-2025',
    contractYearId: 'year-2-active',
  },
  {
    id: 'act-9',
    details: 'Funds added to PO- 9876543219',
    costCenterId: 'cc-sparkling-water',
    costCenterName: 'PepsiCo Cultural Arts Support Fund - 9876543219',
    amount: 3700,
    date: '10-15-2025',
    contractYearId: 'year-2-active',
  },
  {
    id: 'act-10',
    details: 'Funds added to PO- 9876543220',
    costCenterId: 'cc-bottling',
    costCenterName: 'PepsiCo Mental Health Awareness Fund - 9876543220',
    amount: 2900,
    date: '11-01-2025',
    contractYearId: 'year-2-active',
  },
];

const closedCostCenters: CostCenterBudgetRow[] = [
  {
    id: 'cc-year1-a',
    name: 'Pepsi.co baseline contract fund - 1122334455',
    budget: 50000,
    spent: 47000,
    committed: 1000,
    available: 3000,
    assignedUsers: ['K', 'L', 'M'],
    additionalUsers: 4,
    billedSeparately: 0,
  },
  {
    id: 'cc-year1-b',
    name: 'Pepsi.co exploratory insights fund - 2233445566',
    budget: 42000,
    spent: 43000,
    committed: 0,
    available: 0,
    assignedUsers: ['N', 'O'],
    additionalUsers: 1,
    billedSeparately: 1000,
    isOverspent: true,
  },
];

const closedBudgetActivity: BudgetActivityRow[] = [
  {
    id: 'old-1',
    details: 'Contract close-out adjustment',
    costCenterId: 'cc-year1-a',
    costCenterName: 'Pepsi.co baseline contract fund - 1122334455',
    amount: 850,
    date: '04-15-2025',
    contractYearId: 'year-1-closed',
  },
  {
    id: 'old-2',
    details: 'Final reconciliation charge',
    costCenterId: 'cc-year1-b',
    costCenterName: 'Pepsi.co exploratory insights fund - 2233445566',
    amount: 1250,
    date: '05-02-2025',
    contractYearId: 'year-1-closed',
  },
];

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function buildOverviewSummary(
  costCenters: CostCenterBudgetRow[],
): BudgetSummary {
  const totalBudget = sum(costCenters.map((row) => row.budget));
  const spentAmount = sum(costCenters.map((row) => row.spent));
  const committedAmount = sum(costCenters.map((row) => row.committed));
  const availableBalance = sum(costCenters.map((row) => row.available));
  const remainingBalance = availableBalance;
  const assignedUsersCount = 56;

  return {
    totalBudget,
    spentAmount,
    committedAmount,
    availableBalance,
    remainingBalance,
    assignedUsersCount,
  };
}

const overviewByContractYear: Record<
  string,
  CustomerPerceptionBudgetOverviewData
> = {
  'year-2-active': {
    contractYearId: 'year-2-active',
    summary: buildOverviewSummary(activeCostCenters),
    costCenters: activeCostCenters,
    activity: activeBudgetActivity,
  },
  'year-1-closed': {
    contractYearId: 'year-1-closed',
    summary: buildOverviewSummary(closedCostCenters),
    costCenters: closedCostCenters,
    activity: closedBudgetActivity,
  },
};

const commonAssignedUsers: AssignedUserRow[] = [
  {
    id: 'usr-karen',
    name: 'Karen Smith',
    email: 'karen.smith@email.com',
    lastUpdated: '05-15-2025',
    initials: 'K',
    avatarTone: 'blue',
  },
  {
    id: 'usr-lucas',
    name: 'Lucas Brown',
    email: 'lucas.brown@gmail.com',
    lastUpdated: '06-20-2025',
    initials: 'L',
    avatarTone: 'green',
  },
  {
    id: 'usr-maria',
    name: 'Maria Garcia',
    email: 'maria.garcia@yahoo.com',
    lastUpdated: '07-25-2025',
    initials: 'M',
    avatarTone: 'yellow',
  },
  {
    id: 'usr-nathan',
    name: 'Nathan Lee',
    email: 'nathan.lee@outlook.com',
    lastUpdated: '08-30-2025',
    initials: 'N',
    avatarTone: 'purple',
  },
  {
    id: 'usr-olivia',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@icloud.com',
    lastUpdated: '09-14-2025',
    initials: 'O',
    avatarTone: 'pink',
  },
  {
    id: 'usr-peter',
    name: 'Peter Johnson',
    email: 'peter.johnson@aol.com',
    lastUpdated: '10-19-2025',
    initials: 'P',
    avatarTone: 'blue',
  },
  {
    id: 'usr-quinn',
    name: 'Quinn Taylor',
    email: 'quinn.taylor@live.com',
    lastUpdated: '11-22-2025',
    initials: 'Q',
    avatarTone: 'green',
  },
  {
    id: 'usr-rebecca',
    name: 'Rebecca Miller',
    email: 'rebecca.miller@gmail.com',
    lastUpdated: '12-01-2025',
    initials: 'R',
    avatarTone: 'yellow',
  },
  {
    id: 'usr-samuel',
    name: 'Samuel Martinez',
    email: 'samuel.martinez@hotmail.com',
    lastUpdated: '01-08-2025',
    initials: 'S',
    avatarTone: 'purple',
  },
  {
    id: 'usr-tina',
    name: 'Tina Anderson',
    email: 'tina.anderson@yahoo.com',
    lastUpdated: '02-14-2025',
    initials: 'T',
    avatarTone: 'pink',
  },
];

const commonSurveyActivity: SurveyActivityRow[] = [
  {
    id: 'srv-1',
    surveyName: 'Pulse on Customer Sentiment',
    surveyType: 'work-order',
    creatorName: 'John Doe',
    creatorInitials: 'J',
    poNumber: '234567',
    lastUpdated: '05-10-2025',
    projectCost: 62200,
    billableCost: 2200,
    discount: 0,
    researchService: 1000,
    totalCost: 65200,
  },
  {
    id: 'srv-2',
    surveyName: 'Customer preference for food',
    surveyType: 'discover',
    creatorName: 'Jane Smith',
    creatorInitials: 'K',
    poNumber: '234567',
    lastUpdated: '05-15-2025',
    projectCost: 75000,
    billableCost: 3000,
    discount: 0,
    researchService: 1500,
    totalCost: 79500,
  },
  {
    id: 'srv-3',
    surveyName: 'Trends in E-commerce Behavior',
    surveyType: 'work-order',
    creatorName: 'Alice Johnson',
    creatorInitials: 'L',
    poNumber: '234567',
    lastUpdated: '05-20-2025',
    projectCost: 56000,
    billableCost: 2500,
    discount: 0,
    researchService: 500,
    totalCost: 53000,
  },
  {
    id: 'srv-4',
    surveyName: 'Impact of Social Media on Buying Decisions',
    surveyType: 'discover',
    creatorName: 'Bob Williams',
    creatorInitials: 'M',
    poNumber: '234567',
    lastUpdated: '05-25-2025',
    projectCost: 80000,
    billableCost: 5000,
    discount: 0,
    researchService: 2000,
    totalCost: 87000,
  },
  {
    id: 'srv-5',
    surveyName: 'Shifts in Travel Preferences',
    surveyType: 'work-order',
    creatorName: 'David Brown',
    creatorInitials: 'N',
    poNumber: '234567',
    lastUpdated: '06-01-2025',
    projectCost: 45000,
    billableCost: 1500,
    discount: 0,
    researchService: 750,
    totalCost: 47250,
  },
];

function buildDetailSummary(
  purchaseOrders: PurchaseOrderRow[],
  assignedUsers: AssignedUserRow[],
): BudgetSummary {
  const totalBudget = sum(purchaseOrders.map((row) => row.budget));
  const spentAmount = sum(purchaseOrders.map((row) => row.spent));
  const committedAmount = sum(purchaseOrders.map((row) => row.committed));
  const availableBalance = sum(purchaseOrders.map((row) => row.available));

  return {
    totalBudget,
    spentAmount,
    committedAmount,
    availableBalance,
    remainingBalance: availableBalance,
    assignedUsersCount: assignedUsers.length,
    validThroughLabel: 'May 14, 2025 - Aug 13, 2026',
  };
}

function buildPurchaseOrders(costCenterName: string): PurchaseOrderRow[] {
  return [
    {
      id: `${costCenterName}-po-1`,
      name: 'Sparkling water initiative',
      poNumber: '9876543210',
      budget: 65000,
      spent: 50000,
      committed: 8000,
      available: 7000,
      billedSeparately: 0,
      useByDate: '08-13-2026',
      previousUseByDate: 'Previously May 13, 2026',
    },
    {
      id: `${costCenterName}-po-2`,
      name: 'Distribution improvement fund',
      poNumber: '8765432109',
      budget: 20000,
      spent: 18000,
      committed: 3000,
      available: 0,
      billedSeparately: 0,
      useByDate: '08-13-2026',
      previousUseByDate: 'Previously May 13, 2026',
      isOverspent: true,
    },
    {
      id: `${costCenterName}-po-3`,
      name: 'Consumer research initiative',
      poNumber: '7654321098',
      budget: 15000,
      spent: 8000,
      committed: 4000,
      available: 3000,
      billedSeparately: 5000,
      useByDate: '08-13-2026',
      previousUseByDate: 'Previously May 13, 2026',
      isOverspent: true,
    },
    {
      id: `${costCenterName}-po-4`,
      name: 'Others (budget outside of any Purchase Order)',
      poNumber: 'NA',
      budget: 30000,
      spent: 20000,
      committed: 5000,
      available: 5000,
      billedSeparately: 0,
      useByDate: '08-13-2026',
      previousUseByDate: 'Previously May 13, 2026',
    },
  ];
}

const detailsByCostCenterId: Record<string, CostCenterDetailData> =
  activeCostCenters.reduce(
    (acc, costCenter) => {
      const purchaseOrders = buildPurchaseOrders(costCenter.id);

      acc[costCenter.id] = {
        id: costCenter.id,
        costCenterName: costCenter.name,
        contractYearId: 'year-2-active',
        summary: buildDetailSummary(purchaseOrders, commonAssignedUsers),
        purchaseOrders,
        assignedUsers: commonAssignedUsers,
        recentSurveyActivity: commonSurveyActivity,
      };

      return acc;
    },
    {} as Record<string, CostCenterDetailData>,
  );

export const customerPerceptionBudgetMockData: CustomerPerceptionBudgetMockData =
  {
    contractYears,
    overviewByContractYear,
    detailsByCostCenterId,
  };

export function getOverviewData(
  contractYearId: string,
): CustomerPerceptionBudgetOverviewData {
  return (
    customerPerceptionBudgetMockData.overviewByContractYear[contractYearId] ??
    customerPerceptionBudgetMockData.overviewByContractYear['year-2-active']
  );
}

export function getDetailData(costCenterId: string): CostCenterDetailData {
  return (
    customerPerceptionBudgetMockData.detailsByCostCenterId[costCenterId] ??
    customerPerceptionBudgetMockData.detailsByCostCenterId['cc-sparkling-water']
  );
}
