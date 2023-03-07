<p align="center">
  <img alt="demo" src="./demos/demo.png?v=1">
</p>

# ChatGPT UI

A web client for ChatGPT, using OpenAI's API. Provides Docker images and also supports quick deployment to servers using shell scripts.

## 📢Updates

<details open>
<summary><strong>2023-03-04</strong></summary>

**Update to the latest official chat model**  `gpt-3.5-turbo`

**🎉🎉🎉Provide a shell script that can be used to quickly deploy the service to server** [Quick start](#one-click-depolyment)

</details>

<details open>

<summary><strong>2023-02-24</strong></summary>
Version 2 is a major update that separates the backend functionality as an independent project, hosted at [chatgpt-ui-server](https://github.com/WongSaang/chatgpt-ui-server). 

If you still wish to use the old version, please visit the [v1 branch](https://github.com/WongSaang/chatgpt-ui/tree/v1).

Version 2 introduces the following new features:

- 😉 Separation of the frontend and backend, with the backend now using the Python-based Django framework.
- 😘 User authentication, supporting multiple users.
- 😀 Ability to store data in an external database (defaulting to Sqlite).
- 😎 Session persistence, allowing the API to answer questions based on your context.

</details>

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
      #- OPENAI_API_PROXY=https://openai.proxy.com # If you are in China, you can use the proxy provided by the author to speed up the connection to the OpenAI API. If you do not need to use the proxy, you can delete this parameter.
      - DJANGO_SUPERUSER_USERNAME=admin # default superuser name
      - DJANGO_SUPERUSER_PASSWORD=password # default superuser password
      - DJANGO_SUPERUSER_EMAIL=admin@example.com # default superuser email
      # If you want to use the email verification function, you need to configure the following parameters
    #      - EMAIL_HOST=SMTP server address
    #      - EMAIL_PORT=SMTP server port
    #      - EMAIL_HOST_USER=
    #      - EMAIL_HOST_PASSWORD=
    #      - EMAIL_USE_TLS=True
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

### Set API key

After running the services, you can access the web client at `http://localhost`, and an admin panel at `http://localhost:9000/admin`.

Default superuser: `admin`

Default password: `password`

Before you can start chatting, you need to log in to the admin panel to add an OpenAI API key. In the Settings model, add a record with the name `openai_api_key` and the value as your API key.


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