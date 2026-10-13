import { track } from '@vercel/analytics';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userConfigStore, wordStore } from '../store';
import { accurateWPM, calculateAccuracy } from './utils';
import { resetStores } from '../test/utils';
import {
   abandonTest,
   trackTestFinished,
   trackTestRestarted,
   trackTestStarted,
} from './usage-events';

vi.mock('@vercel/analytics', () => ({
   track: vi.fn(),
}));

describe('usage events', () => {
   beforeEach(() => {
      resetStores();
      abandonTest();
   });

   it('should track test_started once with the mode and nothing else', () => {
      userConfigStore.setState({ category: 'time', language: 'french' });

      trackTestStarted();
      trackTestStarted();

      expect(track).toHaveBeenCalledTimes(1);
      expect(track).toHaveBeenCalledWith('test_started', { mode: 'time' });
   });

   it('should track test_finished with mode, duration, word count, wpm, and accuracy', () => {
      const typedEntries = 50;
      const errorCount = 5;
      const duration = 15;
      userConfigStore.setState({
         category: 'time',
         time: duration,
         language: 'spanish',
         theme: 'dark-gray',
         type: 'punctuation',
      });
      wordStore.setState({
         typedEntries,
         errorCount,
         typedHistory: ['hello'],
         userInput: 'secret-text',
      });

      trackTestStarted();
      trackTestFinished();

      expect(track).toHaveBeenLastCalledWith('test_finished', {
         mode: 'time',
         duration,
         wordCount: 2,
         wpm: Number(
            accurateWPM(errorCount, typedEntries, duration).toFixed(2)
         ),
         accuracy: Number(
            calculateAccuracy(errorCount, typedEntries).toFixed(1)
         ),
      });
      expect(JSON.stringify(vi.mocked(track).mock.calls)).not.toMatch(
         /spanish|dark-gray|punctuation|secret-text|hello/
      );
   });

   it('should report the words mode and the words typed', () => {
      userConfigStore.setState({ category: 'words', time: 30 });
      wordStore.setState({
         typedEntries: 14,
         errorCount: 0,
         typedHistory: ['one', 'two', 'three'],
         userInput: '',
      });

      trackTestStarted();
      trackTestFinished();

      expect(track).toHaveBeenLastCalledWith(
         'test_finished',
         expect.objectContaining({
            mode: 'words',
            duration: 30,
            wordCount: 3,
            accuracy: 100,
         })
      );
   });

   it('should not track test_finished when a test never started', () => {
      trackTestFinished();

      expect(track).not.toHaveBeenCalled();
   });

   it('should track a finish only once', () => {
      trackTestStarted();
      trackTestFinished();
      trackTestFinished();

      expect(track).toHaveBeenCalledTimes(2);
   });

   it('should send 0 wpm when the duration is zero', () => {
      userConfigStore.setState({ category: 'time', time: 0 });
      wordStore.setState({
         typedEntries: 10,
         errorCount: 0,
         typedHistory: ['ab'],
         userInput: '',
      });

      trackTestStarted();
      trackTestFinished();

      expect(vi.mocked(track).mock.calls[1]?.[1]).toMatchObject({
         wpm: 0,
         duration: 0,
         wordCount: 1,
      });
   });

   it('should track test_restarted with shortcut or button and allow a new start', () => {
      trackTestStarted();
      trackTestRestarted('shortcut');
      trackTestStarted();
      trackTestRestarted('button');

      expect(track).toHaveBeenNthCalledWith(1, 'test_started', {
         mode: 'time',
      });
      expect(track).toHaveBeenNthCalledWith(2, 'test_restarted', {
         how: 'shortcut',
      });
      expect(track).toHaveBeenNthCalledWith(3, 'test_started', {
         mode: 'time',
      });
      expect(track).toHaveBeenNthCalledWith(4, 'test_restarted', {
         how: 'button',
      });
   });

   it('should allow a new test after the previous one is abandoned', () => {
      trackTestStarted();
      abandonTest();
      trackTestFinished();
      trackTestStarted();

      expect(track).toHaveBeenCalledTimes(2);
      expect(track).toHaveBeenNthCalledWith(2, 'test_started', {
         mode: 'time',
      });
   });
});
