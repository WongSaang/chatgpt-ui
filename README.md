# ChatGPT UI

A web client for ChatGPT, using OpenAI's API. The implementation of the interface part uses [waylaidwanderer/node-chatgpt-api](https://github.com/waylaidwanderer/node-chatgpt-api)

This project is based on [nuxt3](https://nuxt.com/docs/getting-started/introduction)

## Quick start with docker
```bash
docker run -p 80:80 wongsaang/chatgpt-ui:latest
```

## Development

### Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
```

### Development Server

Start the development server on http://localhost:3000

```bash
yarn dev
```

### Production

Build the application for production:

```bash
yarn build
```