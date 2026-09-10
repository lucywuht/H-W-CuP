// @refresh reset

/**
 * @module MetricGroup
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
 * For prop API + usage notes, read `MetricGroup.md` in this folder
 * or run `npx ld-kit show MetricGroup`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/MetricGroup.tsx
 *
 * AX Metric Group — renders 2-3 `core/Metric` side-by-side, separated by
 * vertical dividers.
 *
 * The source uses `<Divider orientation="vertical" />`; ld-kit's
 * `core/Divider` is `<hr>`-based and has no orientation prop, so the
 * vertical separator is a styled `<span>` with the same token-driven color.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Metric, type MetricProps} from '../Metric/Metric';

import './MetricGroup.css';

export interface MetricGroupProps {
  /** 2-3 metric prop objects rendered side-by-side. */
  metrics: MetricProps[];
  className?: string;
}

export const MetricGroup: React.FC<MetricGroupProps> = ({metrics, className}) => {
  if (process.env.NODE_ENV !== 'production') {
    if (metrics.length < 2 || metrics.length > 3) {
      // eslint-disable-next-line no-console
      console.warn(
        `[MetricGroup] Expected 2-3 metrics, received ${metrics.length}.`,
      );
    }
  }

  const items = metrics.slice(0, 3);

  return (
    <div className={cx('ax-metric-group', className)}>
      {items.map((metricProps, index) => (
        <React.Fragment key={index}>
          {index > 0 ? (
            <span className="ax-metric-group__divider" aria-hidden />
          ) : null}
          <Metric {...metricProps} />
        </React.Fragment>
      ))}
    </div>
  );
};


MetricGroup.displayName = 'MetricGroup';
