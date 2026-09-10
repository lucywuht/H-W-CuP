'use client';
// @refresh reset

/**
 * @module Modal
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
 * For prop API + usage notes, read `Modal.md` in this folder
 * or run `npx ld-kit show Modal`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {useStableId, invariant, applyCommonProps} from '../../common/helpers';
import {
  CloseIcon,
} from '../Icons';
import {IconButton, IconButtonButtonProps} from '../IconButton';
import {Heading} from '../Text';
import {SsrBoundary} from '../SsrBoundary';
import { Overlay, OverlayProps, OverlayScrim } from '../Overlay';
import { useCSSTransition, useOnKeyDown, usePointerOutside } from '../../hooks/hooks';
import './Modal.css';

// ---------------------------------------------------------------------------
// ModalPortal (inlined sub-component)
// ---------------------------------------------------------------------------

export type ModalSize = 'small' | 'medium' | 'large';

export type ModalCloseButtonProps = Omit<
  IconButtonButtonProps,
  | 'UNSAFE_className'
  | 'UNSAFE_style'
  | 'a11yLabel'
  | 'children'
  | 'disabled'
  | 'size'
> &
  Partial<Pick<IconButtonButtonProps, 'a11yLabel'>>;

export type ModalCloseEvent =
  | React.MouseEvent<HTMLButtonElement, MouseEvent>
  | PointerEvent
  | MouseEvent
  | TouchEvent
  | KeyboardEvent;

export interface ModalPortalProps
  extends Omit<OverlayProps, 'title'> {
  /**
   * The actions for the modal.
   */
  actions?: React.ReactNode;
  /**
   * The content for the modal.
   */
  children: React.ReactNode;
  /**
   * The props spread to the modal's close button.
   *
   * @default {}
   */
  closeButtonProps?: ModalCloseButtonProps;
  /**
   * If the bottom sheet is open.
   */
  isOpen: boolean;
  /**
   * The callback fired when the modal requests to close.
   */
  onClose: (event: ModalCloseEvent) => void;
  /**
   * The callback fired when the modal transition has ended.
   */
  onClosed?: () => void;
  /**
   * The size for the modal.
   *
   * @default "small"
   */
  size?: ModalSize;
  /**
   * The title for the modal.
   */
  title: React.ReactNode;
}

/**
 * @private
 */
export const ModalPortal: React.FunctionComponent<ModalPortalProps> = (
  props
) => {
  const {
    actions,
    children,
    closeButtonProps,
    isOpen,
    onClose,
    size = 'small',
    title,
    onClosed,
    ...rest
  } = applyCommonProps(props);

  invariant(!!title, 'Required property `title` not provided.');

  const {onClick: closeButtonOnClick, ...closeButtonRest} =
    closeButtonProps || {};

  const overlayRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const titleId = useStableId();

  usePointerOutside(modalRef, onClose);
  useOnKeyDown(['Esc', 'Escape'], onClose);

  const {shouldMount} = useCSSTransition({
    classNames: {
      enter: "ld-modal-modalportal-transitionEnter",
      enterActive: "ld-modal-modalportal-transitionEnterActive",
      exit: "ld-modal-modalportal-transitionExit",
      exitActive: "ld-modal-modalportal-transitionExitActive",
    },
    in: isOpen,
    mountOnEnter: true,
    nodeRef: overlayRef,
    onExited: () => onClosed?.(),
    timeout: 500,
  });

  return shouldMount ? (
      <Overlay ref={overlayRef} {...rest}>
        <div className={'ld-modal-modalportal-container'}>
          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className={cx('ld-modal-modalportal-modal', size === 'large' && 'ld-modal-modalportal-large', size === 'medium' && 'ld-modal-modalportal-medium', size === 'small' && 'ld-modal-modalportal-small')}
            ref={modalRef}
            role="dialog"
          >
            <div className={'ld-modal-modalportal-header'}>
              <IconButton
                a11yLabel="Close dialog"
                {...closeButtonRest}
                onClick={(event) => {
                  closeButtonOnClick?.(event);

                  onClose(event);
                }}
                size="medium"
              >
                <CloseIcon />
              </IconButton>

              <Heading as="h2" id={titleId} UNSAFE_className={'ld-modal-modalportal-title'}>
                {title}
              </Heading>
            </div>

            <div className={'ld-modal-modalportal-content'} /* ref={setScrollableContentElement} */>
              <div className={'ld-modal-modalportal-contentInner'}>{children}</div>
            </div>

            {actions && (
              // NOTE: Safari needs a wrapping block element, otherwise a flex container
              // renders with no height.
              <div className={'ld-modal-modalportal-actionContent'}>{actions}</div>
            )}
          </div>
        </div>
        <OverlayScrim className={'ld-modal-modalportal-scrim'} />
      </Overlay>
  ): null;
};

export interface ModalProps extends ModalPortalProps {}

/**
 * Modals focus the user’s attention on a single task in a window that sits on top of the page content.
 *
 */
export const Modal: React.FunctionComponent<ModalProps> = (props) => {
  const {isOpen, onClosed, ...rest} = props;

  const [isTransitioning, setIsTransitioning] = React.useState(isOpen);
  const previousIsOpen = React.useRef(isOpen);

  /**
   * This hook delays `isOpen` property changes such that the
   * `ModalPortal` component can transition in and out.
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
      <ModalPortal
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

Modal.displayName = 'Modal';
