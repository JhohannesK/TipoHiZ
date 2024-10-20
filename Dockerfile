FROM node:18-alpine AS base
RUN apk add --no-cache g++ make libc6-compat
WORKDIR /app
COPY package*.json ./

FROM base AS builder
COPY . .
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
RUN npm ci && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]

FROM base AS dev
ENV NODE_ENV=development
RUN npm install --legacy-peer-deps
COPY . .
CMD ["npm", "run", "dev"]