import { getServerSession } from '@/lib/auth/session';
import { userIdFromSession } from '@/lib/auth/session-user';
import { resultPayloadFromBody } from '@/lib/stats/result-payload';
import { listResultsForUser, saveResultForUser } from '@/lib/stats/repository';
import { resultSubmissionSchema } from '@/lib/validation/result.schema';

async function requireUserId(): Promise<string | null> {
   return userIdFromSession(await getServerSession());
}

export async function GET() {
   try {
      const userId = await requireUserId();
      if (!userId) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const results = await listResultsForUser(userId);
      return Response.json({ results });
   } catch (error: unknown) {
      console.error('Failed to list test results', error);
      return Response.json(
         { error: 'Failed to list results' },
         { status: 500 }
      );
   }
}

export async function POST(request: Request) {
   try {
      const userId = await requireUserId();
      if (!userId) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const body: unknown = await request.json();
      const payload = resultPayloadFromBody(body);
      const parsed = resultSubmissionSchema.safeParse(payload);
      if (!parsed.success) {
         return Response.json({ error: 'Invalid result' }, { status: 400 });
      }

      const result = await saveResultForUser(userId, parsed.data);
      return Response.json({ result });
   } catch (error: unknown) {
      console.error('Failed to save test result', error);
      return Response.json({ error: 'Failed to save result' }, { status: 500 });
   }
}
