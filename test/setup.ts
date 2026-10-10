import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
   cleanup();
   vi.clearAllMocks();
});

class AudioMock {
   currentTime = 0;
   volume = 1;
   playbackRate = 1;

   pause(): void {}

   play(): Promise<void> {
      return Promise.resolve();
   }
}

globalThis.Audio = AudioMock as unknown as typeof Audio;

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
   Element.prototype.scrollIntoView = () => {};
}
