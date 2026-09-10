// @refresh reset

/**
 * @module LanguageSelector
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
 * For prop API + usage notes, read `LanguageSelector.md` in this folder
 * or run `npx ld-kit show LanguageSelector`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/LanguageSelector.tsx
 *
 * AX Language Selector — circular flag dropdown for switching locales.
 *
 * Adaptation: dropped `react-i18next` (`value` + `onChange` props now
 * drive the active language); inline flag SVGs preserved verbatim from
 * source. Consumer can also pass a custom `languages` list to extend or
 * replace the default English / French / Spanish set.
 */
import * as React from 'react';

import {cx} from '../../common/cx';

import './LanguageSelector.css';

export interface Language {
  code: string;
  label: string;
  /** Small (16px) flag glyph. */
  FlagSmall: () => JSX.Element;
  /** Large (20px) flag glyph for the dropdown row. */
  FlagLarge: () => JSX.Element;
}

export interface LanguageSelectorProps {
  /** Active language code (controlled). Defaults to the first entry in `languages`. */
  value?: string;
  /** Fired when the user picks a language. */
  onChange?: (code: string) => void;
  /** Available languages. Defaults to en / fr / es. */
  languages?: Language[];
  className?: string;
}

const FlagUS = ({size = 16}: {size?: number}) => {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <clipPath id={id}>
          <circle cx="10" cy="10" r="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="20" height="20" fill="#B22234" />
        <rect y="1.538" width="20" height="1.538" fill="#fff" />
        <rect y="4.615" width="20" height="1.538" fill="#fff" />
        <rect y="7.692" width="20" height="1.538" fill="#fff" />
        <rect y="10.769" width="20" height="1.538" fill="#fff" />
        <rect y="13.846" width="20" height="1.538" fill="#fff" />
        <rect y="16.923" width="20" height="1.538" fill="#fff" />
        <rect width="8" height="10.769" fill="#3C3B6E" />
      </g>
    </svg>
  );
};

const FlagFR = ({size = 16}: {size?: number}) => {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <clipPath id={id}>
          <circle cx="10" cy="10" r="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="20" height="20" fill="#ED2939" />
        <rect width="13.333" height="20" fill="#fff" />
        <rect width="6.667" height="20" fill="#002395" />
      </g>
    </svg>
  );
};

const FlagES = ({size = 16}: {size?: number}) => {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <clipPath id={id}>
          <circle cx="10" cy="10" r="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="20" height="20" fill="#c60b1e" />
        <rect y="5" width="20" height="10" fill="#ffc400" />
        <rect x="3" y="6.5" width="3" height="7" fill="#c60b1e" rx="0.5" />
      </g>
    </svg>
  );
};

const CaretDown = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M7.62 10.33c.1.11.23.17.38.17s.28-.06.37-.17l3.5-4a.5.5 0 0 0-.37-.83h-7a.5.5 0 0 0-.38.83l3.5 4Z"
      fill="currentColor"
    />
  </svg>
);

export const DEFAULT_LANGUAGES: Language[] = [
  {
    code: 'en',
    label: 'English (US)',
    FlagSmall: () => <FlagUS size={16} />,
    FlagLarge: () => <FlagUS size={20} />,
  },
  {
    code: 'fr',
    label: 'Français',
    FlagSmall: () => <FlagFR size={16} />,
    FlagLarge: () => <FlagFR size={20} />,
  },
  {
    code: 'es',
    label: 'Español',
    FlagSmall: () => <FlagES size={16} />,
    FlagLarge: () => <FlagES size={20} />,
  },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  languages = DEFAULT_LANGUAGES,
  className,
}) => {
  const [internal, setInternal] = React.useState(languages[0]?.code ?? 'en');
  const active = value ?? internal;
  const currentLang =
    languages.find((l) => l.code === active) ?? languages[0];

  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!currentLang) return null;

  return (
    <div className={cx('ax-language-selector', className)} ref={ref}>
      <button
        type="button"
        className={cx(
          'ax-language-selector__trigger',
          open && 'ax-language-selector__trigger--open',
        )}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${currentLang.label}`}
      >
        <span className="ax-language-selector__flag">
          <currentLang.FlagSmall />
        </span>
        <CaretDown />
      </button>

      {open ? (
        <div
          className="ax-language-selector__dropdown"
          role="listbox"
          aria-label="Select language"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={active === lang.code}
              className={cx(
                'ax-language-selector__option',
                active === lang.code && 'ax-language-selector__option--selected',
              )}
              onClick={() => {
                if (value === undefined) setInternal(lang.code);
                onChange?.(lang.code);
                setOpen(false);
              }}
            >
              <span className="ax-language-selector__flag-large">
                <lang.FlagLarge />
              </span>
              <span className="ax-language-selector__label">{lang.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

LanguageSelector.displayName = 'LanguageSelector';

