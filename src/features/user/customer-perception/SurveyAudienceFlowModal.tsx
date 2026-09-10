import * as React from 'react';
import {
  IconButton as LDIconButton,
  LDIcon,
} from '@walmart-dataventures/shared-components';

interface SurveyAudienceFlowModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export function SurveyAudienceFlowModal({
  isOpen,
  title,
  onClose,
}: SurveyAudienceFlowModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="survey-audience-flow-modal-title"
        style={{
          backgroundColor: 'var(--ld-semantic-color-surface-overlay, #ffffff)',
          borderRadius: 16,
          width: 960,
          maxWidth: '100%',
          minHeight: 420,
          maxHeight: '90vh',
          boxShadow:
            '0px -1px 2px rgba(0,0,0,0.1), 0px 5px 10px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '24px 24px 16px',
          }}
        >
          <div>
            <h2
              id="survey-audience-flow-modal-title"
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'var(--ld-semantic-font-heading-medium-family)',
                lineHeight: '28px',
                color: '#2e2f32',
              }}
            >
              {title}
            </h2>
          </div>
          <LDIconButton
            a11yLabel="Close dialog"
            size="medium"
            variant="secondary"
            onClick={onClose}
          >
            <LDIcon.Close size="medium" aria-hidden />
          </LDIconButton>
        </div>

        <div
          style={{
            padding: '0 24px 24px',
            flex: 1,
            overflow: 'auto',
          }}
        />
      </div>
    </div>
  );
}

export default SurveyAudienceFlowModal;
