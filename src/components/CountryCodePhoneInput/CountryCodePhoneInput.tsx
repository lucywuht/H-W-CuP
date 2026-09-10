// @refresh reset

/**
 * @module CountryCodePhoneInput
 *
 * # CRITICAL AGENT DIRECTIVE - HARD STOP
 * 
 * This file is read-only output. Treat it as immutable.
 * 
 * - NEVER edit this file directly.
 * - NEVER apply "quick fixes" in this file.
 * - NEVER reformat, refactor, or rewrite content in place.
 * - NEVER treat this file as the source of truth.
 * 
 * If behavior must change, modify the upstream source of this content (the canonical source), not this copy.
 * 
 * Any direct edits in this file are invalid and must be rejected.
 *
 * For prop API + usage notes, read `CountryCodePhoneInput.md` in this folder
 * or run `npx ld-kit show CountryCodePhoneInput`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {CaretDownIcon, ExclamationCircleIcon} from '../Icons';
import {Country, WCP_DEFAULT_COUNTRIES, CountrySelectBottomSheet} from '../CountrySelectBottomSheet';
import './CountryCodePhoneInput.css';

export type {Country} from '../CountrySelectBottomSheet';

export interface CountryCodePhoneInputProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  selectedCountry?: Country;
  onCountryChange?: (country: Country) => void;
  countries?: Country[];
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
  errorText?: string;
  placeholder?: string;
  id?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const CountryCodePhoneInput: React.FunctionComponent<CountryCodePhoneInputProps> = (props) => {
  const {
    label = 'Phone number*',
    value = '',
    onChange,
    selectedCountry: controlledCountry,
    onCountryChange,
    countries = WCP_DEFAULT_COUNTRIES,
    disabled = false,
    readOnly = false,
    error = false,
    helperText = "We'll contact you in case anything comes up with your order.",
    errorText = 'Please enter a valid number',
    placeholder = '(000) 000-0000',
    id,
    className,
    ...rest
  } = applyCommonProps(props);

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [internalCountry, setInternalCountry] = React.useState<Country>(
    () => countries.find(c => c.code === 'US') || countries[0]
  );

  const country = controlledCountry ?? internalCountry;

  const handleCountryConfirm = (selected: Country | undefined) => {
    if (!selected) return;
    setInternalCountry(selected);
    onCountryChange?.(selected);
  };

  const inputId = id || 'wcp-phone-input';

  return (
    <div className={cx('ld-wcp-countrycodephoneinput-root', className)} {...rest}>
      <label className={cx('ld-wcp-countrycodephoneinput-label', disabled && 'ld-wcp-countrycodephoneinput-labelDisabled')} htmlFor={inputId}>
        {label}
      </label>
      <div className={cx(
        'ld-wcp-countrycodephoneinput-container',
        error && 'ld-wcp-countrycodephoneinput-containerError',
        disabled && 'ld-wcp-countrycodephoneinput-containerDisabled',
        readOnly && 'ld-wcp-countrycodephoneinput-containerReadOnly',
      )}>
        <button
          type="button"
          className="ld-wcp-countrycodephoneinput-countryTrigger"
          onClick={() => !disabled && !readOnly && setSheetOpen(true)}
          disabled={disabled || readOnly}
          aria-label={`Select country, current: ${country.name}`}
        >
          <img src={country.flagUrl} alt="" className="ld-wcp-countrycodephoneinput-triggerFlag" />
          <span className="ld-wcp-countrycodephoneinput-triggerAbbr">{country.abbr}</span>
          <span className="ld-wcp-countrycodephoneinput-triggerDialCode">{country.dialCode}</span>
          <span className="ld-wcp-countrycodephoneinput-caret"><CaretDownIcon size="small" /></span>
        </button>
        <span className="ld-wcp-countrycodephoneinput-divider" />
        <input
          id={inputId}
          type="tel"
          className="ld-wcp-countrycodephoneinput-phoneInput"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
        />
      </div>
      {error ? (
        <div className="ld-wcp-countrycodephoneinput-errorRow">
          <span className="ld-wcp-countrycodephoneinput-errorIcon"><ExclamationCircleIcon size="small" /></span>
          <span className="ld-wcp-countrycodephoneinput-errorText">{errorText}</span>
        </div>
      ) : helperText ? (
        <span className={cx('ld-wcp-countrycodephoneinput-helperText', disabled && 'ld-wcp-countrycodephoneinput-helperTextDisabled')}>
          {helperText}
        </span>
      ) : null}
      <CountrySelectBottomSheet
        open={sheetOpen}
        countries={countries}
        value={country.code}
        variant="flat"
        onConfirm={handleCountryConfirm}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
};
CountryCodePhoneInput.displayName = 'CountryCodePhoneInput';
