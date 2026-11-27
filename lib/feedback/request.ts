export type FeedbackRequestRef = { current: number };

export function beginFeedbackRequest(ref: FeedbackRequestRef): {
   id: number;
   isLive: () => boolean;
} {
   ref.current += 1;
   const id = ref.current;
   return {
      id,
      isLive: () => ref.current === id,
   };
}

export function abortFeedbackRequest(ref: FeedbackRequestRef): void {
   ref.current += 1;
}
