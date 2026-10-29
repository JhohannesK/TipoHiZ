import { describe, expect, it } from 'vitest';
import { accurateWPM, calculateAccuracy, formatTime, grossWPM } from './utils';

describe('formatTime', () => {
   it('should pad hours, minutes, and seconds', () => {
      expect(formatTime(0)).toBe('00:00:00');
      expect(formatTime(15)).toBe('00:00:15');
      expect(formatTime(75)).toBe('00:01:15');
      expect(formatTime(3661)).toBe('01:01:01');
   });

   it('should floor fractional seconds and clamp negatives to zero', () => {
      expect(formatTime(14.9)).toBe('00:00:14');
      expect(formatTime(-3)).toBe('00:00:00');
   });
});

describe('wpm and accuracy helpers', () => {
   it('should return Infinity when duration is zero so callers must guard', () => {
      expect(accurateWPM(0, 50, 0)).toBe(Infinity);
      expect(grossWPM(50, 0)).toBe(Infinity);
   });

   it('should treat an empty run as 100% and clamp error-heavy runs to 0', () => {
      expect(calculateAccuracy(0, 0)).toBe(100);
      expect(calculateAccuracy(9, 5)).toBe(0);
      expect(calculateAccuracy(1, 4)).toBe(75);
   });
});
