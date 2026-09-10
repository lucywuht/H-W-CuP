// @refresh reset

/**
 * @module CountrySelectGroup
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
 * For prop API + usage notes, read `CountrySelectGroup.md` in this folder
 * or run `npx ld-kit show CountrySelectGroup`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Country, WCP_DEFAULT_COUNTRIES} from '../CountrySelectBottomSheet';
import './CountrySelectGroup.css';

export type {Country} from '../CountrySelectBottomSheet';

export interface CountrySelectGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  countries?: Country[];
  value?: string;
  onChange?: (country: Country) => void;
  description?: string;
  footerText?: string;
  showDialCode?: boolean;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const CountrySelectGroup: React.FunctionComponent<CountrySelectGroupProps> = (props) => {
  const {
    countries = WCP_DEFAULT_COUNTRIES,
    value,
    onChange,
    description = 'Select the country you want to ship to.',
    footerText,
    showDialCode = false,
    className,
    ...rest
  } = applyCommonProps(props);

  const [selected, setSelected] = React.useState(value ?? 'US');

  React.useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const handleSelect = (country: Country) => {
    setSelected(country.code);
    onChange?.(country);
  };

  return (
    <div className={cx('ld-wcp-countryselectgroup-root', className)} {...rest}>
      {description && <p className="ld-wcp-countryselectgroup-description">{description}</p>}
      <ul className="ld-wcp-countryselectgroup-list" role="radiogroup">
        {countries.map((country) => {
          const isSelected = country.code === selected;
          return (
            <li key={country.code}>
              <button
                type="button"
                className={cx('ld-wcp-countryselectgroup-row', isSelected && 'ld-wcp-countryselectgroup-rowSelected')}
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(country)}
              >
                <span className="ld-wcp-countryselectgroup-radio">
                  <svg
                    aria-hidden
                    className="ld-wcp-countryselectgroup-radioSvg"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle className="ld-wcp-countryselectgroup-radioOuter" cx="12" cy="12" r="11" />
                    <circle className="ld-wcp-countryselectgroup-radioInner" cx="12" cy="12" r="4" />
                  </svg>
                </span>
                <img src={country.flagUrl} alt="" className="ld-wcp-countryselectgroup-flag" />
                <span className={cx('ld-wcp-countryselectgroup-name', isSelected && 'ld-wcp-countryselectgroup-nameSelected')}>
                  {country.name}
                </span>
                {showDialCode && <span className="ld-wcp-countryselectgroup-dialCode">{country.dialCode}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {footerText && <p className="ld-wcp-countryselectgroup-footer">{footerText}</p>}
    </div>
  );
};
CountrySelectGroup.displayName = 'CountrySelectGroup';
