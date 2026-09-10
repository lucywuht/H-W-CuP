// @refresh reset

/**
 * @module Resizable
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
 * For prop API + usage notes, read `Resizable.md` in this folder
 * or run `npx ld-kit show Resizable`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/Resizable.tsx
 *
 * AX Resizable — thin wrapper around `react-resizable-panels` (v4)
 * exposing `ResizablePanelGroup`, `ResizablePanel`, and
 * `ResizableHandle`.
 *
 * Adaptation: Tailwind utility classes from the shadcn source are
 * replaced with plain `.css` BEM classes; the `withHandle` grip is
 * inlined as a six-dot SVG instead of pulling `GripVertical` from icons.
 *
 * v4 of `react-resizable-panels` renamed `PanelGroup` → `Group`,
 * `PanelResizeHandle` → `Separator`, and `Panel` retained its name.
 */
import * as React from 'react';
import {Group, Panel, Separator} from 'react-resizable-panels';

import {cx} from '../../common/cx';

import './Resizable.css';

type ResizablePanelGroupProps = Omit<React.ComponentProps<typeof Group>, 'orientation'> & {
  /**
   * AX/PX legacy alias for {@link Group}'s `orientation` prop. v4 of
   * `react-resizable-panels` renamed `direction` to `orientation`; we accept
   * both so existing call sites keep working.
   */
  direction?: 'horizontal' | 'vertical';
  orientation?: 'horizontal' | 'vertical';
};

export const ResizablePanelGroup = ({
  className,
  direction,
  orientation,
  ...props
}: ResizablePanelGroupProps) => (
  <Group
    className={cx('ax-resizable__panel-group', className)}
    orientation={orientation ?? direction}
    {...props}
  />
);

export const ResizablePanel = Panel;

export const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {withHandle?: boolean}) => (
  <Separator className={cx('ax-resizable__handle', className)} {...props}>
    {withHandle ? (
      <div className="ax-resizable__grip" aria-hidden>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <circle cx="3" cy="3" r="0.8" />
          <circle cx="3" cy="5" r="0.8" />
          <circle cx="3" cy="7" r="0.8" />
          <circle cx="7" cy="3" r="0.8" />
          <circle cx="7" cy="5" r="0.8" />
          <circle cx="7" cy="7" r="0.8" />
        </svg>
      </div>
    ) : null}
  </Separator>
);


ResizablePanelGroup.displayName = 'ResizablePanelGroup';
ResizablePanel.displayName = 'ResizablePanel';
ResizableHandle.displayName = 'ResizableHandle';
