FROM node:22-alpine
WORKDIR /app

COPY . .

# Install dependencies (uses BuildKit cache for faster rebuilds)
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
	yarn install --frozen-lockfile

# Generate Prisma and build the API
RUN --mount=type=cache,target=/app/.turbo \
	yarn turbo run build --filter=api

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["yarn", "dev"]