# Quick Start

This project provides related docker images for deployment on a VPS or your local computer. Please note that if your network is unable to request the OpenAI API address, you need to configure a proxy. If you want to make it available to other users, it's best to have a domain name and resolve it to the server.

You also need an OpenAI API Key, and there are multiple ways to obtain it online, please search for it yourself.

## Deploying

### Quickly deploy script

**Note: This script has only been verified on Ubuntu Server 22.04 LTS.**

```
bash <(curl -Ls https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/deployment.sh)
```

### Docker Compose


#### Prepare docker-compose.yml

The project provides a sample `docker-compose.yml`. If you want to customize the configuration, please refer to the [configuration reference](/en/guide/configuration) section.

You can download the `docker-compose.yml` template to your local machine or server by clicking on the link below:

[https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/docker-compose.yml](https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/docker-compose.yml)

You can also manually create the `docker-compose.yml` file and copy the following content into the file:

```
version: '3'
services:
  client:
    platform: linux/x86_64
    image: wongsaang/chatgpt-ui-client:latest
    environment:
      - SERVER_DOMAIN=http://backend-web-server
      - DEFAULT_LOCALE=en
#      - NUXT_PUBLIC_APP_NAME='ChatGPT UI' # The name of the application
#      - NUXT_PUBLIC_TYPEWRITER=true # Whether to enable the typewriter effect, default false
#      - NUXT_PUBLIC_TYPEWRITER_DELAY=50 # The delay time of the typewriter effect, default 50ms
    depends_on:
      - backend-web-server
    ports:
      - '${CLIENT_PORT:-80}:80'
    networks:
      - chatgpt_ui_network
    restart: always
  backend-wsgi-server:
    platform: linux/x86_64
    image: wongsaang/chatgpt-ui-wsgi-server:latest
    environment:
      - APP_DOMAIN=${APP_DOMAIN:-localhost:9000}
      - SERVER_WORKERS=3 # The number of worker processes for handling requests.
      #      - DB_URL=postgres://postgres:postgrespw@localhost:49153/chatgpt # If this parameter is not set, the built-in Sqlite will be used by default. It should be noted that if you do not connect to an external database, the data will be lost after the container is destroyed.
      - DJANGO_SUPERUSER_USERNAME=admin # default superuser name
      - DJANGO_SUPERUSER_PASSWORD=password # default superuser password
      - DJANGO_SUPERUSER_EMAIL=admin@example.com # default superuser email
      - ACCOUNT_EMAIL_VERIFICATION=${ACCOUNT_EMAIL_VERIFICATION:-none} # Determines the e-mail verification method during signup – choose one of "none", "optional", or "mandatory". Default is "optional". If you don't need to verify the email, you can set it to "none".
      # If you want to use the email verification function, you need to configure the following parameters
#      - EMAIL_HOST=SMTP server address
#      - EMAIL_PORT=SMTP server port
#      - EMAIL_HOST_USER=
#      - EMAIL_HOST_PASSWORD=
#      - EMAIL_USE_TLS=True
#      - EMAIL_FROM=no-reply@example.com  #Default sender email address
    ports:
      - '${WSGI_PORT:-8000}:8000'
    networks:
      - chatgpt_ui_network
    restart: always
  backend-web-server:
    platform: linux/x86_64
    image: wongsaang/chatgpt-ui-web-server:latest
    environment:
      - BACKEND_URL=http://backend-wsgi-server:8000
    ports:
      - '${SERVER_PORT:-9000}:80'
    depends_on:
      - backend-wsgi-server
    networks:
      - chatgpt_ui_network
    restart: always

networks:
  chatgpt_ui_network:
    driver: bridge
```

#### Starting the Service

After modifying the configuration as needed, you can start the service by running the following command:

```
docker-compose up --pull always -d
```

This command is used to start the services specified in the Docker Compose configuration. The specific meanings of the parameters are as follows:

- `up`: start the services specified in the Docker Compose configuration.
- `--pull always`: before starting the service each time, the latest version of the image will be pulled from the Docker image repository. This ensures that the image used is always up to date.
- `-d`: run the service in the background. If this parameter is not added, the service will run in the current terminal window until the user manually stops it.

## After Deployment

Access the management panel at `http(s)://your.domain:9000/admin` or `http(s)://123.123.123.123:9000/admin` using the default superuser account:

- username: **admin**
- password: **password**

~~Before starting a chat, you need to add an OpenAI API key. In the management panel, in the "Settings" section, there is a record named `openai_api_key`. Set the value to your API key.~~

In the latest version, a separate API Key management has been added to the admin panel, located under "Provider/Api keys". You can add multiple API Keys here, and the backend program will track the usage of each key's token and balance the usage based on token usage. **To enable this feature, you need to delete the previous "openai_api_key" setting.**

Now you can access the client at `http(s)://your.domain` or `http://123.123.123.123` to start chatting.

🎉🎉🎉 Have fun!