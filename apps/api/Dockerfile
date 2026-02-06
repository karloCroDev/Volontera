# Ignorirajte docker setup nije dobro implementiran, treba ga napraiviti po turborepu

FROM node:22-alpine
WORKDIR /app

COPY . .


RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
	yarn install --frozen-lockfile


RUN --mount=type=cache,target=/app/.turbo \
	yarn turbo run build --filter=api

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["yarn", "dev"]