FROM node:24-bookworm-slim

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

RUN mkdir -p data

ENV NODE_ENV=production \
    PORT=3001 \
    DB_PATH=./data/homelab.db \
    CORS_ORIGIN=*

EXPOSE 3001

CMD ["npm", "start"]
