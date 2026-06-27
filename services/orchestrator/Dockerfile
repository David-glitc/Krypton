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

FROM node:22-alpine

WORKDIR /app

# Copy built dist and orchestrator package.json
COPY --from=builder /build/services/orchestrator/dist ./dist
COPY --from=builder /build/services/orchestrator/package.json ./

# Copy workspace packages so @krypton/* imports resolve
COPY --from=builder /build/packages ./packages

# Copy the root node_modules which contains all hoisted deps + .pnpm store
# Docker COPY preserves symlinks from build stages
COPY --from=builder /build/node_modules ./node_modules

# Symlink the workspace packages into node_modules so resolvable by Node
RUN mkdir -p node_modules/@krypton && \
    ln -sf /app/packages/elizaos-plugin node_modules/@krypton/elizaos-plugin && \
    ln -sf /app/packages/policy-schema node_modules/@krypton/policy-schema && \
    ln -sf /app/packages/sdk node_modules/@krypton/sdk

ENV NODE_ENV=production

CMD ["node", "dist/index.js", "worker"]
