FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/orchestrator/package.json ./services/orchestrator/
COPY packages/elizaos-plugin/package.json ./packages/elizaos-plugin/
COPY packages/policy-schema/package.json ./packages/policy-schema/
COPY packages/sdk/package.json ./packages/sdk/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @krypton/elizaos-plugin build
RUN pnpm --filter @krypton/orchestrator build

FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

COPY --from=builder /build/services/orchestrator/dist ./dist
COPY --from=builder /build/services/orchestrator/package.json ./package.json
COPY --from=builder /build/node_modules/.pnpm ./node_modules/.pnpm

ENV NODE_ENV=production

CMD ["node", "dist/index.js", "worker"]
