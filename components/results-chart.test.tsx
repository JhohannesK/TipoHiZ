import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SecondSample } from '@/lib/stats/types';
import { ResultsChart } from './results-chart';

function sample(
   second: number,
   wpm: number,
   rawWpm: number,
   errors: number
): SecondSample {
   return {
      second,
      wpm,
      rawWpm,
      accuracy: 100,
      characters: 5,
      errors,
   };
}

describe('ResultsChart', () => {
   it('should label the chart and list each second', () => {
      render(
         <ResultsChart samples={[sample(0, 80, 90, 0), sample(1, 40, 70, 2)]} />
      );

      expect(
         screen.getByRole('img', { name: /net wpm and raw wpm/i })
      ).toBeInTheDocument();
      expect(
         screen.getByRole('list', { name: /chart series/i })
      ).toBeInTheDocument();
      expect(
         screen.getByRole('table', {
            name: /net wpm, raw wpm, and errors for each second/i,
         })
      ).toBeInTheDocument();
      expect(screen.getByRole('rowheader', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '2' })).toBeInTheDocument();
      const table = screen.getByRole('table', {
         name: /net wpm, raw wpm, and errors for each second/i,
      });
      expect(table.parentElement).toHaveClass('sr-only');
      expect(table.parentElement).not.toHaveClass('hidden');
      expect(table.parentElement?.className ?? '').not.toMatch(/display/);
   });

   it('should say when a test has no samples', () => {
      render(<ResultsChart samples={[]} />);

      expect(screen.getByText(/no per-second speed data/i)).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(
         screen.queryByRole('button', { name: /per-second speed/i })
      ).not.toBeInTheDocument();
   });

   it('should show the hovered second, then hide it when the pointer leaves', () => {
      render(
         <ResultsChart samples={[sample(0, 80, 90, 0), sample(1, 40, 70, 2)]} />
      );
      const plot = screen.getByRole('button', { name: /per-second speed/i });
      vi.spyOn(plot, 'getBoundingClientRect').mockReturnValue({
         x: 0,
         y: 0,
         top: 0,
         left: 0,
         right: 100,
         bottom: 100,
         width: 100,
         height: 100,
         toJSON() {
            return {};
         },
      });

      fireEvent.pointerMove(plot, {
         clientX: 98,
         clientY: 20,
         pointerType: 'mouse',
      });

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent('Second 2');
      expect(tooltip).toHaveTextContent('40 wpm');
      expect(tooltip).toHaveTextContent('70 raw');
      expect(tooltip).toHaveTextContent('2 errors');
      expect(tooltip).toHaveClass('bg-background');
      expect(tooltip).toHaveClass('text-input');
      expect(tooltip).toHaveClass('border-input/40');
      expect(within(tooltip).getByText('40 wpm')).toHaveClass('text-accent');
      expect(within(tooltip).getByText('2 errors')).toHaveClass(
         'text-wrong_char'
      );
      expect(screen.getByTestId('wpm-chart-guide')).toHaveClass('bg-input');
      expect(screen.getByTestId('wpm-chart-guide')).toHaveStyle({
         left: '98%',
      });

      fireEvent.pointerLeave(plot, { pointerType: 'mouse' });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
   });

   it('should inspect seconds from the keyboard and dismiss with escape', () => {
      render(
         <ResultsChart samples={[sample(0, 80, 90, 0), sample(1, 40, 70, 2)]} />
      );
      const plot = screen.getByRole('button', { name: /per-second speed/i });

      fireEvent.keyDown(plot, { key: 'ArrowRight' });
      expect(screen.getByRole('tooltip')).toHaveTextContent('Second 1');
      expect(screen.getByRole('tooltip')).toHaveTextContent('0 errors');

      fireEvent.keyDown(plot, { key: 'End' });
      expect(screen.getByRole('tooltip')).toHaveTextContent('Second 2');
      expect(screen.getByRole('tooltip')).toHaveTextContent('2 errors');

      fireEvent.keyDown(plot, { key: 'Home' });
      expect(screen.getByRole('tooltip')).toHaveTextContent('Second 1');

      act(() => {
         plot.focus();
      });
      fireEvent.keyDown(plot, { key: 'Escape' });
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
   });

   it('should show the touched second', () => {
      render(
         <ResultsChart samples={[sample(0, 80, 90, 0), sample(1, 40, 70, 2)]} />
      );
      const plot = screen.getByRole('button', { name: /per-second speed/i });
      vi.spyOn(plot, 'getBoundingClientRect').mockReturnValue({
         x: 0,
         y: 0,
         top: 0,
         left: 0,
         right: 100,
         bottom: 100,
         width: 100,
         height: 100,
         toJSON() {
            return {};
         },
      });

      fireEvent.pointerDown(plot, {
         clientX: 2,
         clientY: 10,
         pointerType: 'touch',
      });

      expect(screen.getByRole('tooltip')).toHaveTextContent('Second 1');
      expect(screen.getByRole('tooltip')).toHaveTextContent('80 wpm');
      expect(screen.getByRole('tooltip')).toHaveTextContent('90 raw');
   });
});
