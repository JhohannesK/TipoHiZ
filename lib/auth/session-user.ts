export function userIdFromSession(
   session: { user?: { id?: string | null } | null } | null | undefined
): string | null {
   const id = session?.user?.id;
   if (typeof id !== 'string') return null;
   const trimmed = id.trim();
   return trimmed.length > 0 ? trimmed : null;
}
