import * as React from 'react';

import { PageHeader } from '@walmart-dataventures/shared-components';

type ResearcherLandingPageProps = {
  onOpenSurveyBilling: () => void;
  onOpenCompanyBudgets: () => void;
};

type ChoiceCardProps = {
  title: string;
  description: string;
  onClick: () => void;
};

function SpotIconContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--ld-semantic-color-fill-brand-subtle, #e9f1fe)',
        borderRadius: '50%',
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: 'var(--ld-semantic-color-action-fill-primary, #002e99)',
      }}
    >
      {children}
    </div>
  );
}

function ChoiceCard({ title, description, onClick }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 280,
        minWidth: 186,
        padding: 16,
        backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)',
        borderRadius: 'var(--ld-primitive-scale-borderradius-100, 8px)',
        boxShadow:
          '0px -1px 1px rgba(0,0,0,0.10), 0px 1px 1px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
        textAlign: 'left',
      }}
    >
      <p
        style={{
          fontFamily:
            "var(--ld-semantic-font-body-small-family, 'Everyday_Sans_UI')",
          fontWeight: 700,
          fontSize: 14,
          lineHeight: '20px',
          color: '#2e2f32',
          margin: 0,
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily:
            "var(--ld-semantic-font-body-small-family, 'Everyday_Sans_UI')",
          fontSize: 14,
          lineHeight: '20px',
          color: 'var(--ld-semantic-color-text-subtle, #515357)',
          margin: 0,
        }}
      >
        {description}
      </p>
    </button>
  );
}

export function ResearcherLandingPage({
  onOpenSurveyBilling,
  onOpenCompanyBudgets,
}: ResearcherLandingPageProps) {
  return (
    <>
      <div
        style={{ backgroundColor: 'var(--ld-semantic-color-surface, #ffffff)' }}
      >
        <PageHeader description="Manage survey billing, invoice completed surveys, and track company budgets.">
          Researcher tools
        </PageHeader>
      </div>

      <div
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <section>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <ChoiceCard
              title="Survey billing"
              description="Review and edit survey billing details, invoice completed surveys, and track billing status"
              onClick={onOpenSurveyBilling}
            />
            <ChoiceCard
              title="Company budgets"
              description="Monitor company budgets, spending, and available funds across the organizations"
              onClick={onOpenCompanyBudgets}
            />
          </div>
        </section>
      </div>
    </>
  );
}
