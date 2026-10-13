import { z } from 'zod';

export const compactKeystrokeSchema = z.tuple([
   z.string().min(1).max(16),
   z.string().max(8).nullable(),
   z.enum(['correct', 'incorrect', 'extra', 'backspace']),
   z.number().int().nonnegative().max(86_400_000),
   z.number().int().nonnegative().max(10_000),
]);

export const resultSubmissionSchema = z.object({
   id: z.string().min(8).max(64),
   createdAt: z.string().min(10).max(40),
   mode: z.string().min(1).max(32),
   category: z.string().min(1).max(32),
   language: z.string().min(1).max(32),
   durationSeconds: z.number().positive().max(3_600),
   wordCount: z.number().int().nonnegative().max(10_000),
   words: z.array(z.string().max(128)).max(2_000),
   log: z.array(compactKeystrokeSchema).max(20_000),
});

export const migrateResultsSchema = z.object({
   results: z.array(resultSubmissionSchema).max(50),
});
