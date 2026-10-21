/** @type {import('next').NextConfig} */
const nextConfig = {
   serverExternalPackages: ['mongodb'],
   // Playwright calls the dev server at 127.0.0.1. Next only allows the
   // bind hostname (localhost) unless it is listed here, and blocked dev
   // assets leave the typing passage empty.
   allowedDevOrigins: ['127.0.0.1'],
};

module.exports = nextConfig;
