FROM node:22-alpine
WORKDIR /app

# Copy everything from the root of your project
COPY . .

# Install all dependencies
RUN yarn install

# Generate Prisma and build the API
RUN yarn turbo run build --filter=api

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["yarn", "dev"]