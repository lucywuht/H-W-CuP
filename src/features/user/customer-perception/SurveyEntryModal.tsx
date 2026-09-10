import React from 'react';
import {
  Modal,
  LDIcon,
  Link as DvLink,
} from '@walmart-dataventures/shared-components';

interface SurveyEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFromScratch: () => void;
}

export const SurveyEntryModal: React.FC<SurveyEntryModalProps> = ({
  isOpen,
  onClose,
  onStartFromScratch,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create survey"
      size="medium"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
          minHeight: 460,
        }}
      >
        <button
          type="button"
          onClick={onStartFromScratch}
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            gap: 16,
            border:
              '1px solid var(--ld-semantic-color-border-subtlest, #e3e4e5)',
            borderRadius: 8,
            padding: 24,
            background: 'var(--ld-semantic-color-surface, #ffffff)',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <div
            aria-hidden
            style={{
              width: 52,
              height: 52,
              borderRadius: 8,
              background: 'var(--ld-semantic-color-fill-edited, #6245b7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ld-semantic-color-text-inverse, #ffffff)',
              flexShrink: 0,
            }}
          >
            <LDIcon.Pencil size="small" />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: 'var(--ld-semantic-color-text, #2e2f32)',
                fontSize: 18,
                fontWeight: 700,
                lineHeight: '24px',
              }}
            >
              Start from scratch
            </div>
            <div
              style={{
                color: 'var(--ld-semantic-color-text-subtlest, #74767c)',
                fontSize: 14,
                lineHeight: '20px',
              }}
            >
              Start with a blank survey and add your own questions
            </div>
          </div>

          <div
            aria-hidden
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background:
                'var(--ld-semantic-color-fill-edited-subtle, #ebe8f3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LDIcon.ChevronRight size="small" />
          </div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              height: 1,
              flex: 1,
              background: 'var(--ld-semantic-color-separator, #e3e4e5)',
            }}
          />
          <span
            style={{
              color: 'var(--ld-semantic-color-text-subtle, #515357)',
              fontSize: 16,
              lineHeight: '24px',
            }}
          >
            or
          </span>
          <div
            style={{
              height: 1,
              flex: 1,
              background: 'var(--ld-semantic-color-separator, #e3e4e5)',
            }}
          />
        </div>

        <div
          style={{
            border:
              '1px solid var(--ld-semantic-color-border-subtlest, #e3e4e5)',
            borderRadius: 8,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LDIcon.User size="small" aria-hidden />
          </div>
          <div
            style={{
              color: 'var(--ld-semantic-color-text, #2e2f32)',
              fontSize: 16,
              fontWeight: 700,
              lineHeight: '24px',
            }}
          >
            Partner with a research expert
          </div>
          <div
            style={{
              color: 'var(--ld-semantic-color-text-subtle, #515357)',
              fontSize: 14,
              lineHeight: '20px',
            }}
          >
            With flexible services to help you unlock valuable insights, our
            team of in-house research experts are available to guide you answer
            your 'why' with our verified customers
          </div>
          <DvLink
            href="#"
            onClick={(event) => event.preventDefault()}
            style={{ fontSize: 14 }}
          >
            Contact research team
          </DvLink>
        </div>
      </div>
    </Modal>
  );
};

export default SurveyEntryModal;
