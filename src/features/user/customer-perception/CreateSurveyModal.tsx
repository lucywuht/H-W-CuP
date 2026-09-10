import React, { useState } from 'react';
import {
  Modal,
  TextField,
  TextArea,
  Button,
  ButtonGroup,
} from '@walmart-dataventures/shared-components';

interface CreateSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: SurveyFormData) => void;
}

export interface SurveyFormData {
  surveyName: string;
  surveyObjective: string;
  audienceDescription: string;
}

export const CreateSurveyModal: React.FC<CreateSurveyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<SurveyFormData>({
    surveyName: '',
    surveyObjective: '',
    audienceDescription: '',
  });

  const handleSurveyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, surveyName: e.target.value }));
  };

  const handleObjectiveChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, surveyObjective: e.target.value }));
  };

  const handleAudienceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, audienceDescription: e.target.value }));
  };

  const handleSubmit = () => {
    const isFormComplete =
      formData.surveyName.trim().length > 0 &&
      formData.surveyObjective.trim().length > 0 &&
      formData.audienceDescription.trim().length > 0;

    if (!isFormComplete) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      surveyName: '',
      surveyObjective: '',
      audienceDescription: '',
    });
    onClose();
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#2e2f32',
    margin: 0,
    marginBottom: '0px',
  };

  const descriptionStyle = {
    fontSize: '12px',
    fontWeight: 400,
    color: '#74767c',
    margin: 0,
    marginTop: '0px',
  };

  const isFormComplete =
    formData.surveyName.trim().length > 0 &&
    formData.surveyObjective.trim().length > 0 &&
    formData.audienceDescription.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Start from scratch"
      size="medium"
      actions={
        <ButtonGroup>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!isFormComplete}
            onClick={handleSubmit}
          >
            Create survey
          </Button>
        </ButtonGroup>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          minHeight: 460,
        }}
      >
        {/* Survey name field - no description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={labelStyle}>Survey name</p>
          <TextField
            label=" "
            value={formData.surveyName}
            onChange={handleSurveyNameChange}
            placeholder="Give your project an identifiable name"
          />
        </div>

        {/* Survey objective field - with description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <p style={labelStyle}>Survey objective</p>
            <p style={descriptionStyle}>
              Describe the goal of your survey. This helps our research experts
              in our survey review.
            </p>
          </div>
          <TextArea
            label=" "
            value={formData.surveyObjective}
            onChange={handleObjectiveChange}
            placeholder="Tell us what you're hoping to achieve with this project"
          />
        </div>

        {/* Audience description field - with description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <p style={labelStyle}>Audience description</p>
            <p style={descriptionStyle}>
              Describe the target survey audience. This helps us tailor our
              audience recommendation.
            </p>
          </div>
          <TextArea
            label=" "
            value={formData.audienceDescription}
            onChange={handleAudienceChange}
            placeholder="Describe your target audience, including demographic info"
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateSurveyModal;
