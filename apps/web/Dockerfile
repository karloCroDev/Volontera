FROM node:22-alpine
WORKDIR /app

COPY . .

# Install dependencies (uses BuildKit cache for faster rebuilds)
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
	yarn install --frozen-lockfile

RUN --mount=type=cache,target=/app/.turbo \
	yarn turbo run build --filter=web

EXPOSE 3000

WORKDIR /app/apps/web

CMD ["yarn", "start", "--", "-p", "3000"]