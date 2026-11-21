import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
   afterEach(() => {
      localStorage.clear();
   });

   it('should hydrate the stored JSON value', async () => {
      localStorage.setItem('theme-key', JSON.stringify('mint'));
      const { result } = renderHook(() =>
         useLocalStorage('theme-key', 'fallback')
      );

      await waitFor(() => {
         expect(result.current[0]).toBe('mint');
      });
      expect(JSON.parse(localStorage.getItem('theme-key') ?? 'null')).toBe(
         'mint'
      );
   });

   it('should keep the fallback when stored JSON is corrupt', async () => {
      localStorage.setItem('theme-key', '{not-json');
      const { result } = renderHook(() =>
         useLocalStorage('theme-key', 'fallback')
      );

      await waitFor(() => {
         expect(result.current[0]).toBe('fallback');
      });
   });

   it('should not write the fallback over an existing value on mount', async () => {
      localStorage.setItem('theme-key', JSON.stringify('saved'));
      renderHook(() => useLocalStorage('theme-key', 'fallback'));

      expect(JSON.parse(localStorage.getItem('theme-key') ?? 'null')).toBe(
         'saved'
      );

      await waitFor(() => {
         expect(JSON.parse(localStorage.getItem('theme-key') ?? 'null')).toBe(
            'saved'
         );
      });
   });

   it('should persist after the caller updates the value', async () => {
      const { result } = renderHook(() =>
         useLocalStorage('theme-key', 'fallback')
      );

      await waitFor(() => {
         expect(result.current[0]).toBe('fallback');
      });

      act(() => {
         result.current[1]('next');
      });

      await waitFor(() => {
         expect(JSON.parse(localStorage.getItem('theme-key') ?? 'null')).toBe(
            'next'
         );
      });
   });
});
