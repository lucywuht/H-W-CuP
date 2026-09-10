'use client';
// @refresh reset

/**
 * @module Slider
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
 * For prop API + usage notes, read `Slider.md` in this folder
 * or run `npx ld-kit show Slider`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {mergeRefs} from '../../common/helpers';
import type {CommonProps} from '../../common/helpers';

import './Slider.css';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type SliderSize = 'large' | 'small';

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>,
    CommonProps {
  /** Minimum value. @default 0 */
  min?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /** Step increment. @default 1 */
  step?: number;
  /**
   * Controlled value. Provide `[number]` for a single-value slider or
   * `[number, number]` for a range slider — the number of thumbs is
   * inferred from the array length.
   */
  value?: number[];
  /** Uncontrolled default value. @default [0] */
  defaultValue?: number[];
  /** Callback fired on value change. */
  onValueChange?: (value: number[]) => void;
  /** Disable the slider. @default false */
  disabled?: boolean;
  /**
   * Visual size variant.
   * - `large` — 8px track / 20px thumb, 14px bold label (default)
   * - `small` — 6px track / 16px thumb, 12px semibold label
   * @default "large"
   */
  size?: SliderSize;
  /** Orientation. Currently only horizontal is implemented. @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** Label rendered at the top-left of the slider. */
  label?: React.ReactNode;
  /**
   * Value rendered at the top-right of the slider. Pass a node to show a
   * formatted value (e.g. `"$50"`), or `true` to render the raw current
   * value(s) joined with an en dash for ranges.
   */
  valueLabel?: React.ReactNode | boolean;
  /** Caption rendered at the bottom-left (e.g. the minimum). */
  minLabel?: React.ReactNode;
  /** Caption rendered at the bottom-right (e.g. the maximum). */
  maxLabel?: React.ReactNode;
  /** Hidden input name for form submission. */
  name?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

const THUMB_SIZE: Record<SliderSize, number> = {large: 20, small: 16};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (rawProps, ref) => {
    const {
      className,
      min = 0,
      max = 100,
      step = 1,
      value: controlledValue,
      defaultValue = [0],
      onValueChange,
      disabled = false,
      size = 'large',
      label,
      valueLabel,
      minLabel,
      maxLabel,
      name,
      UNSAFE_className,
      UNSAFE_style,
      ...props
    } = rawProps;

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = isControlled ? controlledValue : internalValue;

    const isRange = currentValue.length >= 2;
    const thumbHalf = THUMB_SIZE[size] / 2;

    const trackRef = React.useRef<HTMLDivElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);
    const activeThumb = React.useRef(0);

    const pct = React.useCallback(
      (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100),
      [min, max],
    );

    const valueFromClientX = React.useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return min;
        const rect = track.getBoundingClientRect();
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
        const raw = min + ratio * (max - min);
        const stepped = Math.round(raw / step) * step;
        return clamp(stepped, min, max);
      },
      [min, max, step],
    );

    const commit = React.useCallback(
      (next: number[]) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const setThumbValue = React.useCallback(
      (index: number, v: number) => {
        const next = [...currentValue];
        next[index] = v;
        if (isRange) {
          // Prevent thumbs from crossing one another.
          if (index === 0) next[0] = Math.min(next[0], next[1]);
          else next[1] = Math.max(next[1], next[0]);
        }
        commit(next);
      },
      [currentValue, isRange, commit],
    );

    const handlePointerDown = React.useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        rootRef.current?.setPointerCapture(e.pointerId);
        isDragging.current = true;
        const v = valueFromClientX(e.clientX);
        // Activate the thumb nearest to the pointer.
        if (isRange) {
          const d0 = Math.abs(v - currentValue[0]);
          const d1 = Math.abs(v - currentValue[1]);
          activeThumb.current = d0 <= d1 ? 0 : 1;
        } else {
          activeThumb.current = 0;
        }
        setThumbValue(activeThumb.current, v);
      },
      [disabled, valueFromClientX, isRange, currentValue, setThumbValue],
    );

    const handlePointerMove = React.useCallback(
      (e: React.PointerEvent) => {
        if (!isDragging.current || disabled) return;
        setThumbValue(activeThumb.current, valueFromClientX(e.clientX));
      },
      [disabled, valueFromClientX, setThumbValue],
    );

    const handlePointerUp = React.useCallback(() => {
      isDragging.current = false;
    }, []);

    const handleKeyDown = (index: number) => (e: React.KeyboardEvent) => {
      if (disabled) return;
      const v = currentValue[index];
      let next = v;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          next = Math.min(max, v + step);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          next = Math.max(min, v - step);
          break;
        case 'Home':
          next = min;
          break;
        case 'End':
          next = max;
          break;
        default:
          return;
      }
      e.preventDefault();
      setThumbValue(index, next);
    };

    /* ----- Derived geometry ----- */
    const lo = isRange ? Math.min(currentValue[0], currentValue[1]) : min;
    const hi = isRange ? Math.max(currentValue[0], currentValue[1]) : currentValue[0] ?? min;
    const fillLeft = isRange ? pct(lo) : 0;
    const fillWidth = isRange ? pct(hi) - pct(lo) : pct(currentValue[0] ?? min);

    /* ----- Header value ----- */
    const renderedValue =
      valueLabel === true
        ? currentValue.map((v) => v).join(' – ')
        : valueLabel === false
          ? null
          : valueLabel;

    const hasHeader = label != null || (renderedValue != null && renderedValue !== '');
    const hasFooter = minLabel != null || maxLabel != null;

    const wrapperClasses = cx(
      'ld-slider',
      size === 'small' && 'ld-slider--small',
      isRange && 'ld-slider--range',
      disabled && 'ld-slider--disabled',
      className,
      UNSAFE_className,
    );

    return (
      <div ref={mergeRefs(ref, rootRef)} className={wrapperClasses} style={UNSAFE_style} {...props}>
        {hasHeader && (
          <div className="ld-slider-header">
            <span className="ld-slider-label">{label}</span>
            <span className="ld-slider-value">{renderedValue}</span>
          </div>
        )}

        <div
          className="ld-slider-control"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div ref={trackRef} className="ld-slider-track">
            <div className="ld-slider-fill" style={{left: `${fillLeft}%`, width: `${fillWidth}%`}} />
          </div>
          {currentValue.map((v, index) => (
            <span
              key={index}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={isRange && index === 1 ? currentValue[0] : min}
              aria-valuemax={isRange && index === 0 ? currentValue[1] : max}
              aria-valuenow={v}
              aria-disabled={disabled || undefined}
              aria-label={isRange ? (index === 0 ? 'Minimum' : 'Maximum') : undefined}
              className="ld-slider-thumb"
              style={{left: `calc(${pct(v)}% - ${thumbHalf}px)`}}
              onKeyDown={handleKeyDown(index)}
            />
          ))}
        </div>

        {hasFooter && (
          <div className="ld-slider-footer">
            <span className="ld-slider-min">{minLabel}</span>
            <span className="ld-slider-max">{maxLabel}</span>
          </div>
        )}

        {name &&
          currentValue.map((v, index) => (
            <input key={index} type="hidden" name={isRange ? `${name}[${index}]` : name} value={v} />
          ))}
      </div>
    );
  },
);

Slider.displayName = 'Slider';

export {Slider};
