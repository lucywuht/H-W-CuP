'use client';
// @refresh reset

/**
 * @module Avatar
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
 * For prop API + usage notes, read `Avatar.md` in this folder
 * or run `npx ld-kit show Avatar`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {invariant, applyCommonProps} from '../../common/helpers';
import {Badge} from '../Badge';
import './Avatar.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AvatarSize = 'xs' | 'small' | 'medium' | 'large' | 'xl';
/** Long-form aliases (xsmall = xs, xlarge = xl). */
export type AvatarSizeAlias = 'xsmall' | 'xlarge';
export type AvatarSizeInput = AvatarSize | AvatarSizeAlias;
export type AvatarShape = 'circular' | 'square';
export type AvatarColor = 'brand' | 'brand-subtle' | 'neutral';

export type AvatarIndicatorType = 'none' | 'badge' | 'clock';
export type AvatarClockState = 'active' | 'subtle';

interface AvatarBaseProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  color?: AvatarColor;
  icon?: React.ReactNode;
  image?: {src: string; alt?: string};
  name?: string;
  shape?: AvatarShape;
  size?: AvatarSizeInput;
  /** Optional overlay indicator. @default 'none' */
  indicator?: AvatarIndicatorType;
  /** Clock state when indicator='clock'. @default 'active' */
  clockState?: AvatarClockState;
  /** Applies disabled fill tokens. @default false */
  disabled?: boolean;
  /** Custom badge content (1+ characters). @default '1' */
  badgeContent?: React.ReactNode;
  /**
   * Optional override children. When provided, takes precedence over
   * image/name/icon. Used for compound-style composition with
   * `<AvatarImage>` / `<AvatarFallback>` children.
   */
  children?: React.ReactNode;
}

export interface AvatarA11yLabelProps extends AvatarBaseProps {
  a11yLabel: string;
  a11yLabelledBy?: never;
}

export interface AvatarA11yLabelledByProps extends AvatarBaseProps {
  a11yLabel?: never;
  a11yLabelledBy: string;
}

export type AvatarProps = AvatarA11yLabelProps | AvatarA11yLabelledByProps;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeSize(size: AvatarSizeInput): AvatarSize {
  if (size === 'xsmall') return 'xs';
  if (size === 'xlarge') return 'xl';
  return size;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function DefaultIcon() {
  return (
    <svg
      aria-hidden="true"
      className="ld-avatar-defaultIcon"
      fill="currentColor"
      height="1em"
      viewBox="0 0 20 20"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-5 9a2 2 0 0 0-2 2c0 1.7.83 2.97 2.13 3.78C6.42 17.58 8.15 18 10 18c1.85 0 3.58-.42 4.87-1.22C16.17 15.97 17 14.7 17 13a2 2 0 0 0-2-2H5Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Compound subcomponents (for back-compat composition style)
// ---------------------------------------------------------------------------

export type AvatarImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Fires whenever the underlying <img> moves between load states. Parent
   * components can use this to swap in an `AvatarFallback` while `loading` or
   * after `error`.
   */
  onLoadingStatusChange?: (status: AvatarImageLoadingStatus) => void;
}

/** Renders the image inside an Avatar when used as a child. */
export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({className, alt = '', src, onLoad, onError, onLoadingStatusChange, ...rest}, ref) => {
    React.useEffect(() => {
      if (!onLoadingStatusChange) return;
      onLoadingStatusChange(src ? 'loading' : 'idle');
    }, [src, onLoadingStatusChange]);

    const handleLoad = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        onLoadingStatusChange?.('loaded');
        onLoad?.(event);
      },
      [onLoad, onLoadingStatusChange],
    );

    const handleError = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        onLoadingStatusChange?.('error');
        onError?.(event);
      },
      [onError, onLoadingStatusChange],
    );

    return (
      <img
        ref={ref}
        className={cx('ld-avatar-image', className)}
        alt={alt}
        src={src}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />
    );
  },
);
AvatarImage.displayName = 'AvatarImage';

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

/** Renders fallback content (e.g. initials) when no image is available. */
export const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  AvatarFallbackProps
>(({className, ...rest}, ref) => (
  <span ref={ref} className={cx('ld-avatar-initials', className)} {...rest} />
));
AvatarFallback.displayName = 'AvatarFallback';

// ---------------------------------------------------------------------------
// Indicator overlays
// ---------------------------------------------------------------------------

function BadgeIndicator({
  size,
  content,
}: {
  size: AvatarSize;
  content: React.ReactNode;
}) {
  return (
    <Badge
      color="blue"
      role="status"
      aria-label="1 notification"
      UNSAFE_className={cx('ld-avatar-badge', `ld-avatar-badge-${size}`)}
    >
      {content}
    </Badge>
  );
}

function ClockIndicator({
  size,
  state,
}: {
  size: AvatarSize;
  state: AvatarClockState;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'ld-avatar-clock',
        `ld-avatar-clock-${size}`,
        state === 'active'
          ? 'ld-avatar-clock--active'
          : 'ld-avatar-clock--subtle',
      )}
    >
      <span className="ld-avatar-clock-dot" />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

type AvatarComponent = React.FunctionComponent<AvatarProps> & {
  Image: typeof AvatarImage;
  Fallback: typeof AvatarFallback;
};

const AvatarFn: React.FunctionComponent<AvatarProps> = (props) => {
  const {
    a11yLabel,
    a11yLabelledBy,
    className,
    color = 'brand',
    icon,
    image,
    name,
    shape = 'circular',
    size: rawSize = 'medium',
    indicator = 'none',
    clockState = 'active',
    disabled = false,
    badgeContent = '1',
    children,
    ...rest
  } = applyCommonProps(props);
  const size = normalizeSize(rawSize);

  const hasA11y = (a11yLabel ? 1 : 0) + (a11yLabelledBy ? 1 : 0) === 1;
  invariant(
    hasA11y,
    '`Avatar` accessibility violation. `Avatar` requires an `a11yLabel` OR an `a11yLabelledBy`.',
  );

  const [imgError, setImgError] = React.useState(false);

  const showImage = image?.src && !imgError;
  const initials = name ? getInitials(name) : '';

  const a11yProps = a11yLabel
    ? {'aria-label': a11yLabel, role: 'img' as const}
    : {'aria-labelledby': a11yLabelledBy, role: 'img' as const};

  const classes = cx(
    'ld-avatar-root',
    `ld-avatar-${size}`,
    `ld-avatar-${shape}`,
    `ld-avatar-${color}`,
    disabled && 'ld-avatar-disabled',
    className,
  );

  // Compound mode: when children are passed, render them directly inside the
  // avatar surface and let consumers compose with AvatarImage / AvatarFallback.
  const inner = children ? (
    children
  ) : showImage ? (
    <img
      alt={image.alt || ''}
      className="ld-avatar-image"
      onError={() => setImgError(true)}
      src={image.src}
    />
  ) : initials ? (
    <span className="ld-avatar-initials">{initials}</span>
  ) : icon ? (
    <span className="ld-avatar-icon">{icon}</span>
  ) : (
    <span className="ld-avatar-icon">
      <DefaultIcon />
    </span>
  );

  return (
    <span
      className={classes}
      aria-disabled={disabled || undefined}
      {...a11yProps}
      {...rest}
    >
      <span className="ld-avatar-surface">{inner}</span>
      {indicator === 'badge' && (
        <BadgeIndicator size={size} content={badgeContent} />
      )}
      {indicator === 'clock' && (
        <ClockIndicator size={size} state={clockState} />
      )}
    </span>
  );
};

AvatarFn.displayName = 'Avatar';

export const Avatar = AvatarFn as AvatarComponent;
Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;

// ---------------------------------------------------------------------------
// AvatarButton — interactive wrapper
// ---------------------------------------------------------------------------

export interface AvatarButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'className' | 'color'
  > {
  size?: AvatarSizeInput;
  shape?: AvatarShape;
  color?: AvatarColor;
  indicator?: AvatarIndicatorType;
  clockState?: AvatarClockState;
  badgeContent?: React.ReactNode;
  name?: string;
  icon?: React.ReactNode;
  image?: {src: string; alt?: string};
  disabled?: boolean;
  /** Accessible label for the button. */
  'aria-label'?: string;
  className?: string;
  children?: React.ReactNode;
}

type AvatarButtonComponent = React.FunctionComponent<AvatarButtonProps> & {
  Image: typeof AvatarImage;
  Fallback: typeof AvatarFallback;
};

const AvatarButtonFn: React.FunctionComponent<AvatarButtonProps> = (props) => {
  const {
    onClick,
    disabled = false,
    'aria-label': ariaLabel,
    className,
    size = 'medium',
    shape,
    color,
    indicator,
    clockState,
    badgeContent,
    name,
    icon,
    image,
    children,
    ...rest
  } = props;
  const normalized = normalizeSize(size);
  const needsHitSlot =
    normalized === 'xs' || normalized === 'small' || normalized === 'medium';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'ld-avatar-button',
        needsHitSlot && 'ld-avatar-button--hit-slot',
        disabled && 'ld-avatar-button--disabled',
        className,
      )}
      {...rest}
    >
      <Avatar
        a11yLabel={ariaLabel ?? 'Avatar'}
        size={size}
        shape={shape}
        color={color}
        indicator={indicator}
        clockState={clockState}
        badgeContent={badgeContent}
        name={name}
        icon={icon}
        image={image}
        disabled={disabled}
      >
        {children}
      </Avatar>
    </button>
  );
};

AvatarButtonFn.displayName = 'AvatarButton';

export const AvatarButton = AvatarButtonFn as AvatarButtonComponent;
AvatarButton.Image = AvatarImage;
AvatarButton.Fallback = AvatarFallback;
