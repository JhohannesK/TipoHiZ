import { getServerSession } from '@/lib/auth/session';
import { userIdFromSession } from '@/lib/auth/session-user';
import { saveResultsForUser } from '@/lib/stats/repository';
import { migrateResultsSchema } from '@/lib/validation/result.schema';

export async function POST(request: Request) {
   try {
      const userId = userIdFromSession(await getServerSession());
      if (!userId) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const body: unknown = await request.json();
      const parsed = migrateResultsSchema.safeParse(body);
      if (!parsed.success) {
         return Response.json({ error: 'Invalid results' }, { status: 400 });
      }

      const saved = await saveResultsForUser(userId, parsed.data.results);
      return Response.json({ saved });
   } catch (error: unknown) {
      console.error('Failed to migrate test results', error);
      return Response.json(
         { error: 'Failed to migrate results' },
         { status: 500 }
      );
   }
}
