/** @type {import('next').NextConfig} */
const nextConfig = {
   serverExternalPackages: ['mongodb'],
   // Playwright loads the dev server at 127.0.0.1. Next blocks that host
   // unless it is listed here, so the client bundle never hydrates.
   allowedDevOrigins: ['127.0.0.1'],
};

module.exports = nextConfig;
