export function mongoTransactionsEnabled(uri: string): boolean {
   return uri.startsWith('mongodb+srv://') || /(?:^|[?&])replicaSet=/.test(uri);
}
