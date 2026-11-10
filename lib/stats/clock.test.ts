import { afterEach, describe, expect, it } from 'vitest';
import {
   keystrokeTimestamp,
   resetKeystrokeClock,
   restoreKeystrokeClock,
   setKeystrokeClock,
} from './clock';

describe('keystrokeTimestamp', () => {
   afterEach(() => {
      restoreKeystrokeClock();
   });

   it('should return 0 for the first sample and then elapsed ms', () => {
      let now = 1_000;
      setKeystrokeClock(() => now);

      expect(keystrokeTimestamp()).toBe(0);
      now = 1_250;
      expect(keystrokeTimestamp()).toBe(250);
   });

   it('should return 0 when the clock moves backwards', () => {
      let now = 500;
      setKeystrokeClock(() => now);
      expect(keystrokeTimestamp()).toBe(0);

      now = 100;
      expect(keystrokeTimestamp()).toBe(0);
   });

   it('should restart the origin after resetKeystrokeClock', () => {
      let now = 10;
      setKeystrokeClock(() => now);
      expect(keystrokeTimestamp()).toBe(0);
      now = 40;
      expect(keystrokeTimestamp()).toBe(30);

      resetKeystrokeClock();
      now = 80;
      expect(keystrokeTimestamp()).toBe(0);
      now = 95;
      expect(keystrokeTimestamp()).toBe(15);
   });
});
