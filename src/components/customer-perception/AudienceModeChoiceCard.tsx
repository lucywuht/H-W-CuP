import * as React from 'react';
import { ChoiceCard } from '@walmart-dataventures/shared-components';

import './AudienceModeChoiceCard.css';

type AudienceModeChoiceCardProps = {
  checked: boolean;
  description: string;
  illustration?: React.ReactNode;
  name: string;
  onChange: () => void;
  title: string;
};

export function AudienceModeChoiceCard({
  checked,
  description,
  illustration,
  name,
  onChange,
  title,
}: AudienceModeChoiceCardProps) {
  return (
    <ChoiceCard
      checked={checked}
      UNSAFE_className="cp-audience-mode-choice-card"
      hideControlLabel
      inputType="radio"
      label={title}
      name={name}
      onChange={onChange}
      bodyContent={
        <div className="cp-audience-mode-choice-card__body">
          <div
            aria-hidden={illustration ? undefined : true}
            className="cp-audience-mode-choice-card__illustration"
          >
            {illustration ?? null}
          </div>
          <div className="cp-audience-mode-choice-card__title">{title}</div>
          <div className="cp-audience-mode-choice-card__description">
            {description}
          </div>
        </div>
      }
    />
  );
}

export default AudienceModeChoiceCard;
