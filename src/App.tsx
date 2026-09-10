import * as React from 'react';
import '@walmart-dataventures/shared-components/dist/index.css';
import { SnackbarProvider } from './components/Snackbar';
import { useInitializeTheming } from './utils/Theming';
import { useInitializeStore } from './utils/Store';
import { A11yAnnouncementProvider } from './components/A11yAnnouncement';
import { SurveyAudienceBuilderPage } from './features/user/customer-perception/SurveyAudienceBuilderPage';

export default function App() {
  useInitializeTheming('Data Ventures', ['Data Ventures'] as const);
  useInitializeStore();

  return (
    <A11yAnnouncementProvider>
      <SnackbarProvider>
        <div style={{ minHeight: '100vh', overflow: 'auto' }}>
          <SurveyAudienceBuilderPage
            projectName="H&W CuP Survey"
            onBack={() => undefined}
          />
        </div>
      </SnackbarProvider>
    </A11yAnnouncementProvider>
  );
}
