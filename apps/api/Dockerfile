FROM node:20-alpine
WORKDIR /app

# Copy everything from the root of your project
COPY . .

# Install all dependencies
RUN yarn install

# Generate Prisma and build the API
RUN yarn turbo run build --filter=api

EXPOSE 8080

CMD ["node", "src/server.ts"]