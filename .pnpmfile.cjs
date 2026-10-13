// @better-auth/infra calls Zod 4 (`z.url`). The app stays on Zod 3, so
// drop the peer and pin infra's own zod. Otherwise pnpm links Zod 3 and
// importing dash() throws.
function readPackage(pkg) {
   if (pkg.name !== '@better-auth/infra') return pkg;

   pkg.dependencies = {
      ...pkg.dependencies,
      zod: '4.6.7',
   };
   if (pkg.peerDependencies) {
      delete pkg.peerDependencies.zod;
   }
   return pkg;
}

module.exports = {
   hooks: {
      readPackage,
   },
};
