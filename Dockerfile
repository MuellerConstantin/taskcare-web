FROM node:18-alpine AS build

RUN mkdir -p /usr/local/src/taskcare/web
WORKDIR /usr/local/src/taskcare/web

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY public ./public
COPY next.config.mjs ./
COPY tailwind.config.mjs ./
COPY postcss.config.mjs ./
COPY jsconfig.json ./
COPY .env* ./

RUN rm -rf public/mockServiceWorker.js || true

ENV NEXT_OUTPUT_MODE=standalone

RUN npm run build

FROM node:18-alpine

RUN mkdir -p /usr/local/bin/taskcare/web
WORKDIR /usr/local/bin/taskcare/web

COPY --from=build /usr/local/src/taskcare/web/.next/standalone ./
COPY --from=build /usr/local/src/taskcare/web/.next/static ./.next/static
COPY --from=build /usr/local/src/taskcare/web/public ./public

ENTRYPOINT ["node", "server.js"]
