FROM node:18-alpine3.16 as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]