export type SharedPurchaseOrderOption = {
  id: string;
  label: string;
  costCenter: string;
  availableBalance: number;
  validThrough: string;
};

export const SHARED_PURCHASE_ORDER_OPTIONS: SharedPurchaseOrderOption[] = [
  {
    id: '12345-new-bottling-concept',
    label: '12345 - New bottling concept',
    costCenter: 'Pepsi.co Scintilla fund',
    availableBalance: 10500,
    validThrough: '08-13-2026',
  },
  {
    id: '23456-new-campaign',
    label: '23456 - New campaign',
    costCenter: 'Pepsi.co Scintilla fund',
    availableBalance: 350,
    validThrough: '08-13-2026',
  },
  {
    id: '36723-new-marketing',
    label: '36723- New marketing',
    costCenter: 'Pepsi.co Scintilla fund',
    availableBalance: 76,
    validThrough: '08-13-2026',
  },
];
