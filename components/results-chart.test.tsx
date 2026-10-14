import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
   });

   it('should say when a test has no samples', () => {
      render(<ResultsChart samples={[]} />);

      expect(screen.getByText(/no per-second speed data/i)).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
   });
});
