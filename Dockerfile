FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install

FROM gcr.io/distroless/nodejs18-debian11 AS mailer
COPY --from=builder /app /app
WORKDIR /app

ENV NODE_NO_WARNINGS=1

EXPOSE 5173

CMD [ "--loader", "ts-node/esm", "/app/src/vite-server.ts" ]