'use client';
// @refresh reset

/**
 * @module BottomSheet
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
 * For prop API + usage notes, read `BottomSheet.md` in this folder
 * or run `npx ld-kit show BottomSheet`.
 */

import * as React from 'react';
import {useStableId, applyCommonProps} from '../../common/helpers';
import {
  CloseIcon,
} from '../Icons';
import {IconButton, IconButtonButtonProps} from '../IconButton';
import {SsrBoundary} from '../SsrBoundary';
import { Overlay, OverlayProps, OverlayScrim } from '../Overlay';
import { useCSSTransition, useOnKeyDown, usePointerOutside } from '../../hooks/hooks';
import './BottomSheet.css';

// ---------------------------------------------------------------------------
// BottomSheetPortal (inlined sub-component)
// ---------------------------------------------------------------------------

export type BottomSheetCloseButtonProps = Omit<
  IconButtonButtonProps,
  | 'UNSAFE_className'
  | 'UNSAFE_style'
  | 'a11yLabel'
  | 'children'
  | 'disabled'
  | 'size'
> &
  Partial<Pick<IconButtonButtonProps, 'a11yLabel'>>;

export type BottomSheetCloseEvent =
  | React.MouseEvent<HTMLButtonElement, MouseEvent>
  | KeyboardEvent
  | MouseEvent
  | PointerEvent
  | TouchEvent;

export interface BottomSheetPortalProps
  extends Omit<OverlayProps, 'title'> {
  /**
   * The actions for the bottom sheet.
   */
  actions?: React.ReactNode;
  /**
   * The props spread to the bottom sheet's close button.
   */
  closeButtonProps?: BottomSheetCloseButtonProps;
  /**
   * The content for the bottom sheet.
   */
  children: React.ReactNode;
  /**
   * If the bottom sheet is open.
   *
   * @default false
   */
  isOpen?: boolean;
  /**
   * The callback fired when the bottom sheet requests to close.
   */
  onClose: (event: BottomSheetCloseEvent) => void;
  /**
   * The callback fired when the bottom sheet transition has ended.
   */
  onClosed?: () => void;
  /**
   * The title for the bottom sheet.
   */
  title: React.ReactNode;
}

/**
 * @private
 */
export const BottomSheetPortal: React.FunctionComponent<
  BottomSheetPortalProps
> = (props) => {
  const {
    actions,
    closeButtonProps,
    children,
    isOpen = false,
    onClose,
    onClosed,
    title,
    ...rest
  } = applyCommonProps(props);

  const overlayRef = React.useRef<HTMLDivElement>(null);
  const bottomSheetRef = React.useRef<HTMLDivElement>(null);
  const titleId = useStableId();

  usePointerOutside(bottomSheetRef, onClose);
  useOnKeyDown(['Esc', 'Escape'], onClose);

  const {shouldMount} = useCSSTransition({
    classNames: {
      enter: 'ld-bottomsheet-bottomsheetportal-transitionEnter',
      enterActive: 'ld-bottomsheet-bottomsheetportal-transitionEnterActive',
      exit: 'ld-bottomsheet-bottomsheetportal-transitionExit',
      exitActive: 'ld-bottomsheet-bottomsheetportal-transitionExitActive',
    },
    in: isOpen,
    mountOnEnter: true,
    nodeRef: overlayRef,
    onExited: () => onClosed?.(),
    timeout: 900
  });

  return shouldMount && (
    <Overlay ref={overlayRef} {...rest}>
      <div className={'ld-bottomsheet-bottomsheetportal-container'}>
        <div
          aria-modal="true"
          className={'ld-bottomsheet-bottomsheetportal-bottomSheet'}
          ref={bottomSheetRef}
          role="dialog"
          {...(title && {'aria-labelledby': titleId})}
        >
          <div className={'ld-bottomsheet-bottomsheetportal-header'}>
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

            <h2 className={'ld-bottomsheet-bottomsheetportal-title'} id={titleId}>
              {title}
            </h2>
          </div>
          <div className={'ld-bottomsheet-bottomsheetportal-content'}>
            <div className={'ld-bottomsheet-bottomsheetportal-contentInner'}>{children}</div>
          </div>

          {actions && <div className={'ld-bottomsheet-bottomsheetportal-actionContent'}>{actions}</div>}
        </div>
      </div>
      <OverlayScrim className={'ld-bottomsheet-bottomsheetportal-scrim'} />
    </Overlay>
  );
};

export type BottomSheetProps = BottomSheetPortalProps;

/**
 * Bottom Sheets are surfaces anchored to the bottom of the screen that contain supplementary content.
 * *
 */
export const BottomSheet: React.FunctionComponent<BottomSheetProps> = (
  props
) => {
  const {isOpen, onClosed, ...rest} = props;

  const [isTransitioning, setIsTransitioning] = React.useState(isOpen);
  const previousIsOpen = React.useRef(isOpen);

  /**
   * This hook delays `isOpen` property changes such that the
   * `BottomSheetPortal` component can transition in and out.
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
      <BottomSheetPortal
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

BottomSheet.displayName = 'BottomSheet';
