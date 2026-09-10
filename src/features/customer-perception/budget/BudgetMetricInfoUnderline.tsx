import * as React from 'react';

import { DVPopover } from '@walmart-dataventures/shared-components';

type BudgetMetricInfoUnderlineProps = {
  label: string;
};

const popoverContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 352,
  boxSizing: 'border-box',
};

const popoverTitleStyle: React.CSSProperties = {
  margin: 0,
  color: 'var(--ld-semantic-color-text, #2e2f32)',
  fontSize: 14,
  fontWeight: 700,
  lineHeight: '20px',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
};

const popoverBodyStyle: React.CSSProperties = {
  margin: 0,
  color: 'var(--ld-semantic-color-text, #2e2f32)',
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
};

const triggerStyle: React.CSSProperties = {
  appearance: 'none',
  background: 'transparent',
  border: 0,
  color: 'inherit',
  cursor: 'pointer',
  display: 'inline-flex',
  padding: 0,
  textAlign: 'left',
  maxWidth: '100%',
};

const triggerTextStyle: React.CSSProperties = {
  display: 'inline-block',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  borderBottom: '2.24px dotted #babbbe',
  paddingBottom: 1,
};

const budgetMetricCopy: Record<string, { body: string; formula?: string }> = {
  'Total budget': {
    body: 'The total funds allocated for surveys. It represents the maximum amount available, including funds that have already been spent, reserved for active surveys, and still available for future surveys.',
    formula: 'Total Budget = Spent + Committed + Remaining Balance',
  },
  'Spent amount': {
    body: 'The total amount billed for completed surveys. These charges have been finalized and deducted from the available budget.',
    formula: 'Total Budget = Spent + Committed + Remaining Balance',
  },
  'Committed amount': {
    body: 'Funds reserved for active surveys that have not yet been billed. Once these surveys are completed and invoiced, the committed amount moves to Spent.',
    formula: 'Total Budget = Spent + Committed + Remaining Balance',
  },
  'Remaining balance': {
    body: 'The funds still available for future surveys. This amount reflects the budget remaining after accounting for both billed surveys and funds reserved for active surveys.',
    formula: 'Total Budget = Spent + Committed + Remaining Balance',
  },
  'Billed separately': {
    body: 'The amount charged for surveys that exceeds the available budget. These charges are invoiced separately from the allocated budget.',
  },
};

export function BudgetMetricInfoUnderline({
  label,
}: BudgetMetricInfoUnderlineProps) {
  const copy = budgetMetricCopy[label] ?? budgetMetricCopy['Total budget'];
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const content = React.useMemo(
    () => (
      <div style={popoverContentStyle}>
        <p style={popoverTitleStyle}>{label}</p>
        <p style={popoverBodyStyle}>{copy.body}</p>
        {copy.formula ? <p style={popoverBodyStyle}>{copy.formula}</p> : null}
      </div>
    ),
    [copy.body, copy.formula, label],
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={() => setIsOpen((current) => !current)}
        style={triggerStyle}
      >
        <span style={triggerTextStyle}>{label}</span>
      </button>
      <DVPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
        content={content}
        position="bottomCenter"
        hasNubbin
        maxWidth="384px"
      />
    </>
  );
}
