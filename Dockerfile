FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

FROM base AS build

COPY . .

RUN npx prisma generate

RUN npm run build

FROM base AS production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/generated ./prisma/generated

CMD [ "node", "dist/main" ]