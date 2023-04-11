FROM node:18-alpine3.16 as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN rm -r server && SSR=false yarn generate


FROM nginx:1.22-alpine

WORKDIR /app

COPY --from=builder /app/.output/public .

COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80