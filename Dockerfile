FROM node:18-alpine3.16 as builder

ENV NITRO_PORT=80

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 80

# TODO: You can use NITRO_PRESET=node_cluster in order to leverage multi-process performance using Node.js cluster module. https://nuxt.com/docs/getting-started/deployment

ENTRYPOINT ["node", ".output/server/index.mjs"]