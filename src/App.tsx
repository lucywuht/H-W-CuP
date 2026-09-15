import * as React from 'react';
import '@walmart-dataventures/shared-components/dist/index.css';
import { SnackbarProvider } from './components/Snackbar';
import { useInitializeTheming } from './utils/Theming';
import { useInitializeStore } from './utils/Store';
import { A11yAnnouncementProvider } from './components/A11yAnnouncement';
import { SurveyAudienceBuilderPage } from './features/user/customer-perception/SurveyAudienceBuilderPage';

type AppPage = 'landing' | 'future-phase' | 'phase-1';

function LandingPage({ onNavigate }: { onNavigate: (page: AppPage) => void }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ld-semantic-color-background-subtle, #f8f8f8)',
        gap: 48,
        padding: 32,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--ld-semantic-color-text, #2e2f32)',
            marginBottom: 8,
          }}
        >
          H&W CuP
        </div>
        <div
          style={{
            fontSize: 16,
            color: 'var(--ld-semantic-color-text-subtle, #515357)',
          }}
        >
          Health &amp; Wellness Customer Understanding Platform
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => onNavigate('future-phase')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            width: 220,
            height: 160,
            padding: 24,
            background: '#fff',
            border: '2px solid #e3e4e5',
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 18,
            fontWeight: 700,
            color: '#2e2f32',
            fontFamily: 'inherit',
            transition: 'background 0.15s, box-shadow 0.15s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#f8f8f8';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#fff';
          }}
        >
          <span style={{ fontSize: 32 }}>🔭</span>
          Future phase
        </button>

        <button
          type="button"
          onClick={() => onNavigate('phase-1')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            width: 220,
            height: 160,
            padding: 24,
            background: '#fff',
            border: '2px solid #e3e4e5',
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 18,
            fontWeight: 700,
            color: '#2e2f32',
            fontFamily: 'inherit',
            transition: 'background 0.15s, box-shadow 0.15s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#f8f8f8';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#fff';
          }}
        >
          <span style={{ fontSize: 32 }}>🚀</span>
          Phase 1
        </button>
      </div>
    </div>
  );
}

function Phase1Page({ onBack }: { onBack: () => void }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ld-semantic-color-background-subtle, #f8f8f8)',
        gap: 24,
        padding: 32,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: 'var(--ld-semantic-color-text-subtle, #515357)',
        }}
      >
        🚧
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#2e2f32' }}>Phase 1</div>
      <div style={{ fontSize: 16, color: '#515357' }}>Coming soon — TBD</div>
      <button
        type="button"
        onClick={onBack}
        style={{
          marginTop: 16,
          padding: '10px 24px',
          background: '#fff',
          border: '1px solid #e3e4e5',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          color: '#2e2f32',
          fontFamily: 'inherit',
        }}
      >
        ← Back
      </button>
    </div>
  );
}

export default function App() {
  useInitializeTheming('Data Ventures', ['Data Ventures'] as const);
  useInitializeStore();

  const [page, setPage] = React.useState<AppPage>('landing');

  return (
    <A11yAnnouncementProvider>
      <SnackbarProvider>
        {page === 'landing' && (
          <LandingPage onNavigate={setPage} />
        )}
        {page === 'future-phase' && (
          <div style={{ minHeight: '100vh', overflow: 'auto' }}>
            <SurveyAudienceBuilderPage
              projectName="H&W CuP Survey"
              onBack={() => setPage('landing')}
            />
          </div>
        )}
        {page === 'phase-1' && (
          <div style={{ minHeight: '100vh', overflow: 'auto' }}>
            <SurveyAudienceBuilderPage
              projectName="H&W CuP Survey"
              onBack={() => setPage('landing')}
              isPhase1
            />
          </div>
        )}
      </SnackbarProvider>
    </A11yAnnouncementProvider>
  );
}
