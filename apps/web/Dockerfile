FROM node:22-alpine
WORKDIR /app

# Kopiram sve bitno iz web foldera
COPY . .

# Instaliram sve dependcije
RUN yarn install
RUN yarn turbo run build --filter=web

EXPOSE 3000

WORKDIR /app/apps/web

CMD ["yarn", "start", "--", "-p", "3000"]