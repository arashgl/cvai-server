FROM node:20 as builder

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY nx.json .
COPY tsconfig.base.json .
COPY tsconfig.json .
COPY workspace.json .
COPY apps/nest-api ./apps/nest-api
COPY libs ./libs

RUN npm install -g bun
RUN bun install
RUN bun nx build nest-api

EXPOSE ${PORT}
CMD ["node", "dist/apps/nest-api/main.js"] 