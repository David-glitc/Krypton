FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/policy-schema/package.json ./packages/policy-schema/
COPY packages/sdk/package.json ./packages/sdk/
COPY packages/ui/package.json ./packages/ui/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @krypton/web build

FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

COPY --from=builder /build/apps/web/.output ./.output
COPY --from=builder /build/apps/web/package.json ./package.json
COPY --from=builder /build/node_modules/.pnpm ./node_modules/.pnpm

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
