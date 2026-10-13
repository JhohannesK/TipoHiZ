import {
   connectAndRunMigration,
   formatMigrationReport,
   parseMigrationArgs,
} from '../lib/auth/migrate-next-auth';

async function main() {
   let mode: ReturnType<typeof parseMigrationArgs>;
   try {
      mode = parseMigrationArgs(process.argv.slice(2));
   } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
      return;
   }

   const uri = process.env.MONGODB_URI;
   if (!uri) {
      console.error('MONGODB_URI is not set');
      process.exitCode = 1;
      return;
   }

   const report = await connectAndRunMigration(uri, mode);
   console.log(formatMigrationReport(report));
}

main().catch((error: unknown) => {
   console.error(error);
   process.exitCode = 1;
});
