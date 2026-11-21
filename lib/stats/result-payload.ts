export function resultPayloadFromBody(body: unknown): unknown {
   if (
      body !== null &&
      typeof body === 'object' &&
      !Array.isArray(body) &&
      'result' in body
   ) {
      return (body as { result: unknown }).result;
   }
   return body;
}
