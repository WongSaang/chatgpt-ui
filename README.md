<div align="center">
<h1>ChatGPT UI</h1>
</div>

[English](./README.md) | [中文](./docs/zh/README.md)

A ChatGPT web client that supports multiple users, multiple database connections for persistent data storage, supports i18n. Provides Docker images and quick deployment scripts.

https://user-images.githubusercontent.com/46235412/227156264-ca17ab17-999b-414f-ab06-3f75b5235bfe.mp4


## 📢Updates
<details open>
<summary><strong>2023-03-23</strong></summary>
Added web search capability to generate more relevant and up-to-date answers from ChatGPT!
This feature is off by default, you can turn it on in `Chat->Settings` in the admin panel, there is a record `open_web_search` in Settings, set its value to True.

</details>

<details open>
<summary><strong>2023-03-15</strong></summary>

Add "open_registration" setting option in the admin panel to control whether user registration is enabled. You can log in to the admin panel and find this setting option under `Chat->Setting`. The default value of this setting is `True` (allow user registration). If you do not need it, please change it to `False`.


</details>

<details open>
<summary><strong>2023-03-10</strong></summary>

Add 2 environment variables to control the typewriter effect:

- `NUXT_PUBLIC_TYPEWRITER=true` to enable/disable the typewriter effect
- `NUXT_PUBLIC_TYPEWRITER_DELAY=50` to set the delay time for each character in milliseconds.

</details>

<details open>
<summary><strong>2023-03-04</strong></summary>

**Update to the latest official chat model**  `gpt-3.5-turbo`

**🎉🎉🎉Provide a shell script that can be used to quickly deploy the service to server** [Quick start](#one-click-depolyment)

</details>

<details>

<summary><strong>2023-02-24</strong></summary>
Version 2 is a major update that separates the backend functionality as an independent project, hosted at [chatgpt-ui-server](https://github.com/WongSaang/chatgpt-ui-server). 

If you still wish to use the old version, please visit the [v1 branch](https://github.com/WongSaang/chatgpt-ui/tree/v1).

</details>

## Version 2 introduces the following new features:

- 😉 Separation of the frontend and backend, with the backend now using the Python-based Django framework.
- 😘 User authentication, supporting multiple users.
- 😀 Ability to store data in an external database (defaulting to Sqlite).
- 😎 Session persistence, allowing the API to answer questions based on your context.

## 🚀 One-click deployment <a name="one-click-depolyment"></a>

Note: This script has only been tested on Ubuntu Server 22.04 LTS.

```bash
bash <(curl -Ls https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/deployment.sh)
```

> If you have a domain name, you can point it to the server's IP address using DNS resolution. Of course, using the server's IP address directly is also possible. 
> During the script's execution, you will be prompted to enter a domain name. If you do not have a domain name, you can enter the server's IP address directly.

### After the deployment is complete

Access `http(s)://your.domain:9000/admin` / IP `http(s)://123.123.123.123:9000/admin` to log in to the administration panel.

Default superuser: `admin`

Default password: `password`

Before you can start chatting, you need to add an OpenAI API key. In the Settings model, add a record with the name `openai_api_key` and the value as your API key.

Now you can access the web client at `http(s)://your.domain` or `http://123.123.123.123` to start chatting.

🎉🎉🎉 Enjoy it!

## Quick start with Docker Compose

### Run services

Below is a docker-compose.yml template:

```yaml
version: '3'
services:
  client:
    image: wongsaang/chatgpt-ui-client:latest
    environment:
      - SERVER_DOMAIN=http://backend-web-server
      - NUXT_PUBLIC_APP_NAME='ChatGPT UI' # App name
      - NUXT_PUBLIC_TYPEWRITER=true # Enable typewriter effect, default is false
      - NUXT_PUBLIC_TYPEWRITER_DELAY=100 # Typewriter effect delay time, default is 50ms
      - NUXT_PUBLIC_CUSTOM_API_KEY=false # [true|false] Whether to enable the API Key setting module (default: false)
    depends_on:
      - backend-web-server
    ports:
      - '80:80'
    networks:
      - chatgpt_ui_network
  backend-wsgi-server:
    image: wongsaang/chatgpt-ui-wsgi-server:latest
    environment:
      - APP_DOMAIN=${APP_DOMAIN:-localhost:9000} # CSRF whitelist，Add the address of your chatgpt-ui-web-server here, default is localhost:9000
      #- DB_URL=postgres://postgres:postgrespw@localhost:49153/chatgpt # If this parameter is not set, the built-in Sqlite will be used by default. It should be noted that if you do not connect to an external database, the data will be lost after the container is destroyed.
      #- OPENAI_API_PROXY=https://openai.proxy.com/v1 # Proxy for https://api.openai.com/v1
      - DJANGO_SUPERUSER_USERNAME=admin # default superuser name
      - DJANGO_SUPERUSER_PASSWORD=password # default superuser password
      - DJANGO_SUPERUSER_EMAIL=admin@example.com # default superuser email
      - ACCOUNT_EMAIL_VERIFICATION=none # Determines the e-mail verification method during signup – choose one of "none", "optional", or "mandatory". Default is "optional". If you don't need to verify the email, you can set it to "none".
      # If you want to use the email verification function, you need to configure the following parameters
    #      - EMAIL_HOST=SMTP server address
    #      - EMAIL_PORT=SMTP server port
    #      - EMAIL_HOST_USER=
    #      - EMAIL_HOST_PASSWORD=
    #      - EMAIL_USE_TLS=True
    #      - EMAIL_FROM=no-reply@example.com  #Default sender email address
    ports:
      - '8000:8000'
    networks:
      - chatgpt_ui_network
  backend-web-server:
    image: wongsaang/chatgpt-ui-web-server:latest
    environment:
      - BACKEND_URL=http://backend-wsgi-server:8000
    ports:
      - '9000:80'
    depends_on:
      - backend-wsgi-server
    networks:
      - chatgpt_ui_network

networks:
  chatgpt_ui_network:
    driver: bridge
```

### DB_URL schema

| Engine               | URL                                              |
|----------------------|--------------------------------------------------|
| PostgreSQL           | ``postgres://USER:PASSWORD@HOST:PORT/NAME``      |
| MySQL                | ``mysql://USER:PASSWORD@HOST:PORT/NAME``         |
| SQLite               | ``sqlite:///PATH``                               |


### Set API key

Access `http(s)://your.domain:9000/admin` / IP `http(s)://123.123.123.123:9000/admin` to log in to the administration panel.

Default superuser: `admin`

Default password: `password`

Before you can start chatting, you need to add an OpenAI API key. In the Settings model, add a record with the name `openai_api_key` and the value as your API key.

Now you can access the web client at `http(s)://your.domain` or `http://123.123.123.123` to start chatting.

## Donation

> If it is helpful to you, it is also helping me. 

If you want to support me, Buy me a coffee ❤️ [https://www.buymeacoffee.com/WongSaang](https://www.buymeacoffee.com/WongSaang)

<p align="center">
  <img height="150" src="https://github.com/WongSaang/chatgpt-ui/blob/main/demos/bmc_qr.png?raw=true"/>
</p>

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
