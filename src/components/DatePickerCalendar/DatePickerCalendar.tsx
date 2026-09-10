// @refresh reset

/**
 * @module DatePickerCalendar
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
 * For prop API + usage notes, read `DatePickerCalendar.md` in this folder
 * or run `npx ld-kit show DatePickerCalendar`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/DatePickerCalendar.tsx
 *
 * AX Date Picker Calendar — single / multiple / range calendar grid with
 * month navigation. Hand-rolled (no `react-day-picker`) to match the
 * source's exact LD 3.5 styling.
 *
 * Adaptation: CSS module → plain `.css` w/ BEM classes, `UNSAFE_style` →
 * plain `style`, `@/components/icons` chevrons replaced with inlined SVGs.
 */
import * as React from 'react';

import {cx} from '../../common/cx';

import './DatePickerCalendar.css';

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type DatePickerCalendarMode = 'single' | 'multiple' | 'range';
export type DatePickerCalendarVariant = 'standalone' | 'embedded';

export interface DatePickerCalendarProps {
  /** Selected date (single mode convenience). */
  value?: Date;
  /** Callback when a date is selected. */
  onSelect?: (date: Date | undefined) => void;
  /** Selection mode. */
  mode?: DatePickerCalendarMode;
  /** Multiple / range selection state. */
  selected?: Date | Date[] | DateRange;
  /** Disable specific dates. */
  disabled?: ((date: Date) => boolean) | Date | Date[];
  /** Minimum selectable date. */
  fromDate?: Date;
  /** Maximum selectable date. */
  toDate?: Date;
  /** Show week numbers in a leading column. */
  showWeekNumbers?: boolean;
  /** First day of week (0=Sun…6=Sat). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Default month (uncontrolled). */
  defaultMonth?: Date;
  /** Current month (controlled). */
  month?: Date;
  /** Callback when the visible month changes. */
  onMonthChange?: (month: Date) => void;
  /** `standalone` adds elevation + bg, `embedded` is bare for composition. */
  variant?: DatePickerCalendarVariant;
  /** Hide the prev/next chevrons (e.g. paired calendar). */
  hideNavigation?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 18l6-6-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DatePickerCalendar = React.forwardRef<
  HTMLDivElement,
  DatePickerCalendarProps
>((props, ref) => {
  const {
    value,
    onSelect,
    mode = 'single',
    selected,
    disabled,
    fromDate,
    toDate,
    showWeekNumbers = false,
    weekStartsOn = 0,
    defaultMonth,
    month: controlledMonth,
    onMonthChange,
    variant = 'standalone',
    hideNavigation = false,
    className,
    style,
  } = props;

  const [internalMonth, setInternalMonth] = React.useState<Date>(
    controlledMonth || defaultMonth || value || new Date(),
  );
  const currentMonth =
    controlledMonth !== undefined ? controlledMonth : internalMonth;

  const handleMonthChange = React.useCallback(
    (newMonth: Date) => {
      if (controlledMonth === undefined) setInternalMonth(newMonth);
      onMonthChange?.(newMonth);
    },
    [controlledMonth, onMonthChange],
  );

  const goToPreviousMonth = React.useCallback(() => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() - 1);
    handleMonthChange(next);
  }, [currentMonth, handleMonthChange]);

  const goToNextMonth = React.useCallback(() => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    handleMonthChange(next);
  }, [currentMonth, handleMonthChange]);

  const monthYear = React.useMemo(() => {
    const monthName = currentMonth.toLocaleDateString('en-US', {month: 'short'});
    return `${monthName} ${currentMonth.getFullYear()}`;
  }, [currentMonth]);

  const dayNames = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (weekStartsOn === 0 || !showWeekNumbers) return days;
    return ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  }, [weekStartsOn, showWeekNumbers]);

  const calendarDays = React.useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDayOfWeek = firstDay.getDay();
    if (showWeekNumbers) {
      startDayOfWeek = (firstDay.getDay() + 1) % 7;
    } else if (weekStartsOn !== 0) {
      startDayOfWeek = (startDayOfWeek - weekStartsOn + 7) % 7;
    }

    const totalDays = lastDay.getDate();
    const prevMonthTotal = new Date(year, month, 0).getDate();

    const prev: Array<{date: Date; isCurrentMonth: boolean}> = [];
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      prev.push({
        date: new Date(year, month - 1, prevMonthTotal - i),
        isCurrentMonth: false,
      });
    }

    const cur: Array<{date: Date; isCurrentMonth: boolean}> = [];
    for (let day = 1; day <= totalDays; day++) {
      cur.push({date: new Date(year, month, day), isCurrentMonth: true});
    }

    const totalCells = prev.length + cur.length;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const next: Array<{date: Date; isCurrentMonth: boolean}> = [];
    for (let day = 1; day <= remaining; day++) {
      next.push({date: new Date(year, month + 1, day), isCurrentMonth: false});
    }

    return [...prev, ...cur, ...next];
  }, [currentMonth, weekStartsOn, showWeekNumbers]);

  const weeks = React.useMemo(() => {
    const out: Array<typeof calendarDays> = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      out.push(calendarDays.slice(i, i + 7));
    }
    return out;
  }, [calendarDays]);

  const getWeekNumber = (date: Date): number => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const isDateDisabled = React.useCallback(
    (date: Date): boolean => {
      if (fromDate && date < fromDate) return true;
      if (toDate && date > toDate) return true;
      if (typeof disabled === 'function') return disabled(date);
      if (disabled instanceof Date) {
        return date.toDateString() === disabled.toDateString();
      }
      if (Array.isArray(disabled)) {
        return disabled.some((d) => date.toDateString() === d.toDateString());
      }
      return false;
    },
    [disabled, fromDate, toDate],
  );

  const isDateSelected = React.useCallback(
    (date: Date): boolean => {
      if (mode === 'single') {
        const sd = (selected as Date) || value;
        return sd ? date.toDateString() === sd.toDateString() : false;
      }
      if (mode === 'multiple' && Array.isArray(selected)) {
        return selected.some((d) => date.toDateString() === d.toDateString());
      }
      if (
        mode === 'range' &&
        selected &&
        typeof selected === 'object' &&
        'from' in selected
      ) {
        const {from, to} = selected as DateRange;
        if (!from) return false;
        if (!to) return date.toDateString() === from.toDateString();
        return date >= from && date <= to;
      }
      return false;
    },
    [mode, selected, value],
  );

  const isRangeStart = React.useCallback(
    (date: Date): boolean => {
      if (
        mode !== 'range' ||
        !selected ||
        typeof selected !== 'object' ||
        !('from' in selected)
      )
        return false;
      const {from} = selected as DateRange;
      return from ? date.toDateString() === from.toDateString() : false;
    },
    [mode, selected],
  );

  const isRangeEnd = React.useCallback(
    (date: Date): boolean => {
      if (
        mode !== 'range' ||
        !selected ||
        typeof selected !== 'object' ||
        !('from' in selected)
      )
        return false;
      const {from, to} = selected as DateRange;
      if (!from || !to) return false;
      return date.toDateString() === to.toDateString();
    },
    [mode, selected],
  );

  const isInRange = React.useCallback(
    (date: Date): boolean => {
      if (
        mode !== 'range' ||
        !selected ||
        typeof selected !== 'object' ||
        !('from' in selected)
      )
        return false;
      const {from, to} = selected as DateRange;
      if (!from || !to) return false;
      return date > from && date < to;
    },
    [mode, selected],
  );

  const isToday = React.useCallback((date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const handleDayClick = React.useCallback(
    (date: Date) => {
      if (isDateDisabled(date)) return;
      onSelect?.(date);
    },
    [isDateDisabled, onSelect],
  );

  return (
    <div
      ref={ref}
      className={cx(
        'ax-date-picker-calendar',
        variant === 'embedded' && 'ax-date-picker-calendar--embedded',
        className,
      )}
      style={style}
    >
      <div className="ax-date-picker-calendar__header">
        {!hideNavigation && (
          <button
            type="button"
            className="ax-date-picker-calendar__nav ax-date-picker-calendar__nav--prev"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </button>
        )}
        <div className="ax-date-picker-calendar__month-year">{monthYear}</div>
        {!hideNavigation && (
          <button
            type="button"
            className="ax-date-picker-calendar__nav ax-date-picker-calendar__nav--next"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      <div className="ax-date-picker-calendar__grid">
        <div
          className={cx(
            'ax-date-picker-calendar__day-headers',
            showWeekNumbers && 'ax-date-picker-calendar__day-headers--with-weeks',
          )}
        >
          {showWeekNumbers && (
            <div className="ax-date-picker-calendar__day-header ax-date-picker-calendar__day-header--week-number">
              WM
              <br />
              WK
            </div>
          )}
          {dayNames.map((day, i) => (
            <div key={i} className="ax-date-picker-calendar__day-header">
              {day}
            </div>
          ))}
        </div>

        <div className="ax-date-picker-calendar__weeks">
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className={cx(
                'ax-date-picker-calendar__week',
                showWeekNumbers && 'ax-date-picker-calendar__week--with-weeks',
              )}
            >
              {showWeekNumbers && (
                <div className="ax-date-picker-calendar__week-number">
                  {getWeekNumber(week[0].date)}
                </div>
              )}
              {week.map((day, dayIndex) => {
                const sel = isDateSelected(day.date);
                const dis = isDateDisabled(day.date);
                const today = isToday(day.date);
                const rangeStart = isRangeStart(day.date);
                const rangeEnd = isRangeEnd(day.date);
                const inRange = isInRange(day.date);

                return (
                  <button
                    key={dayIndex}
                    type="button"
                    className={cx(
                      'ax-date-picker-calendar__day',
                      !day.isCurrentMonth && 'ax-date-picker-calendar__day--outside',
                      sel &&
                        !rangeStart &&
                        !rangeEnd &&
                        !inRange &&
                        'ax-date-picker-calendar__day--selected',
                      dis && 'ax-date-picker-calendar__day--disabled',
                      today && 'ax-date-picker-calendar__day--today',
                      rangeStart && 'ax-date-picker-calendar__day--range-start',
                      rangeEnd && 'ax-date-picker-calendar__day--range-end',
                      inRange && 'ax-date-picker-calendar__day--in-range',
                    )}
                    onClick={() => handleDayClick(day.date)}
                    disabled={dis}
                    aria-label={day.date.toLocaleDateString()}
                    aria-selected={sel}
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

DatePickerCalendar.displayName = 'DatePickerCalendar';

