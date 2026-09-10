'use client';
// @refresh reset

/**
 * @module Panel
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
 * For prop API + usage notes, read `Panel.md` in this folder
 * or run `npx ld-kit show Panel`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {useStableId, invariant, applyCommonProps} from '../../common/helpers';
import {
  CloseIcon,
} from '../Icons';
import {IconButton, IconButtonButtonProps} from '../IconButton';
import {SsrBoundary} from '../SsrBoundary';
import { useCSSTransition, useOnKeyDown, usePointerOutside } from '../../hooks/hooks';
import { Overlay, OverlayProps, OverlayScrim } from '../Overlay';
import './Panel.css';

// ---------------------------------------------------------------------------
// PanelPortal (inlined sub-component)
// ---------------------------------------------------------------------------

export type PanelCloseButtonProps = Omit<
  IconButtonButtonProps,
  | 'UNSAFE_className'
  | 'UNSAFE_style'
  | 'a11yLabel'
  | 'children'
  | 'disabled'
  | 'size'
> &
  Partial<Pick<IconButtonButtonProps, 'a11yLabel'>>;

export type PanelCloseEvent =
  | React.MouseEvent<HTMLButtonElement, MouseEvent>
  | KeyboardEvent
  | MouseEvent
  | PointerEvent
  | TouchEvent;

export type PanelPosition = 'left' | 'right';

export type PanelSize = 'large' | 'medium' | 'small';

export interface PanelPortalProps
  extends Omit<OverlayProps, 'title'> {
  /**
   * The actions for the panel.
   */
  actions?: React.ReactNode;
  /**
   * The content for the panel.
   */
  children: React.ReactNode;
  /**
   * The props spread to the panel's close button.
   */
  closeButtonProps?: PanelCloseButtonProps;
  /**
   * If the Panel is open.
   */
  isOpen: boolean;
  /**
   * The callback fired when the panel requests to close.
   */
  onClose: (event: PanelCloseEvent) => void;
  /**
   * The callback fired when the panel transition has ended.
   */
  onClosed?: () => void;
  /**
   * The position for the panel.
   *
   * @default "left"
   */
  position?: PanelPosition;
  /**
   * The size for the panel.
   *
   * @default "small"
   */
  size?: PanelSize;
  /**
   * The title for the panel.
   */
  title: React.ReactNode;
}

/**
 * @private
 */
export const PanelPortal: React.FunctionComponent<PanelPortalProps> = (
  props
) => {
  const {
    actions,
    children,
    closeButtonProps,
    onClose,
    onClosed,
    isOpen,
    position = 'left',
    size = 'small',
    title,
    ...rest
  } = applyCommonProps(props);

  invariant(!!title, 'Required property `title` not provided.');

  const overlayRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = useStableId();

  usePointerOutside(panelRef, onClose);
  useOnKeyDown(['Esc', 'Escape'], onClose);

  const {shouldMount} = useCSSTransition({
    classNames:{
      enter: 'ld-panel-panelportal-transitionEnter',
      enterActive: 'ld-panel-panelportal-transitionEnterActive',
      exit: 'ld-panel-panelportal-transitionExit',
      exitActive: 'ld-panel-panelportal-transitionExitActive',
    },
    in: isOpen,
    mountOnEnter: true,
    nodeRef: overlayRef,
    onExited: () => onClosed?.(),
    timeout: 300
  });

  return shouldMount && (
      <Overlay ref={overlayRef} {...rest}>
        <div
          className={cx('ld-panel-panelportal-container', position === 'left' && 'ld-panel-panelportal-left', position === 'right' && 'ld-panel-panelportal-right')}
        >
          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className={cx('ld-panel-panelportal-panel', size === 'small' && 'ld-panel-panelportal-small', size === 'medium' && 'ld-panel-panelportal-medium', size === 'large' && 'ld-panel-panelportal-large')}
            ref={panelRef}
            role="dialog"
          >
            <div className={'ld-panel-panelportal-header'}>
              <IconButton
                a11yLabel="Close dialog"
                {...closeButtonProps}
                onClick={(event) => {
                  closeButtonProps?.onClick?.(event);

                  onClose(event);
                }}
                size={"medium"}
              >
                <CloseIcon />
              </IconButton>

              <h2 className={'ld-panel-panelportal-title'} id={titleId}>
                {title}
              </h2>
            </div>

            <div className={'ld-panel-panelportal-content'}>
              <div className={'ld-panel-panelportal-contentInner'}>{children}</div>
            </div>

            {actions && <div className={'ld-panel-panelportal-actionContent'}>{actions}</div>}
          </div>
        </div>
        <OverlayScrim className={'ld-panel-panelportal-scrim'} />
      </Overlay>
  );
};

export type PanelProps = PanelPortalProps;

/**
 * Panels provide supplemental information or form inputs that relate to the primary canvas.
 */
export const Panel: React.FunctionComponent<PanelProps> = (props) => {
  const {isOpen, onClosed, ...rest} = props;

  const [isTransitioning, setIsTransitioning] = React.useState(isOpen);
  const previousIsOpen = React.useRef(isOpen);

  /**
   * This hook delays `isOpen` property changes such that the
   * `Panel` component can transition in and out.
   */
    React.useEffect(() => {
    if (previousIsOpen.current === isOpen) {
      return;
    }

    previousIsOpen.current = isOpen;

    const handle = setTimeout(() => {
      setIsTransitioning(true);
    }, 0);

    return () => clearTimeout(handle);
  }, [isOpen]);

  if (!isOpen && !isTransitioning) {
    return null;
  }

  return (
    <SsrBoundary>
      <PanelPortal
        isOpen={isOpen && isTransitioning}
        onClosed={() => {
          setIsTransitioning(false);
          onClosed?.();
        }}
        {...rest}
      />
    </SsrBoundary>
  );
};

Panel.displayName = 'Panel';
