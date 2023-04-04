FROM node:18-alpine3.16 as builder

ENV NITRO_PORT=80

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 80

ENTRYPOINT ["node", ".output/server/index.mjs"]