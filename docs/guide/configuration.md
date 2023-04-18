# Configuration Reference

## Database

By default, the backend uses the built-in Sqlite to store data. If an external database is not connected, the data will be lost after the container is destroyed.

The `chatgpt-ui-wsgi-server` image provides the environment variable `DB_URL` to configure the connection to an external database. The following table shows the link format of the `DB_URL`.

| DB                | LINK                                             |
|----------------------|--------------------------------------------------|
| PostgreSQL           | postgres://USER:PASSWORD@HOST:PORT/DATABASE_NAME |
| MySQL                | mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME    |
| SQLite               | sqlite:///PATH                                   |

For example, if I am using PostgreSQL, the configuration is as follows:

```
backend-wsgi-server:
    image: wongsaang/chatgpt-ui-wsgi-server:latest
    environment:
      - DB_URL=postgres://postgres:postgrespw@localhost:49153/chatgpt
```

## Email verification

If you open the user registration feature and need to send email activation links to users, you need to configure the following environment variables in the `wsgi-server` service:

| Parameters                  | Description                                             | Default |
|----------------------|--------------------------------------------------|-----|
| ACCOUNT_EMAIL_VERIFICATION | E-mail authentication method, optional value: none, optional, mandatory | optional |
| EMAIL_HOST                 | SMTP server address    |  smtp.mailgun.org    |
| EMAIL_PORT                 | SMTP server port  |   587       |
| EMAIL_HOST_USER            | User name             |    -         |
| EMAIL_HOST_PASSWORD        | Password              |     -     |
| EMAIL_USE_TLS              | Whether to encrypt    |   True       |
| EMAIL_FROM                 | From email            |     webmaster@localhost  |

## API Proxy

If you are unable to request the OpenAI API address due to network restrictions, you can configure a proxy in the `wsgi-server` service. You will need to search for how to set up a proxy server on your own.

For example:

```
backend-wsgi-server:
    image: wongsaang/chatgpt-ui-wsgi-server:latest
    environment:
      - OPENAI_API_PROXY=https://openai.proxy.com/v1
```

## Backend CSRF whitelist

If you encounter `CSRF verification failed` while accessing the management background, your `APP_DOMAIN` may not be configured correctly. Under the `wsgi-server` service, there is an environment variable `wsgi-server`. Its value should be the address and port of `backend-web-server`, default: `localhost:9000`.

Suppose I have resolved the domain name `chagpt.com` to the server, and my `backend-web-server` service is bound to port 9000. The correct configuration is as follows:

```
backend-wsgi-server:
    image: wongsaang/chatgpt-ui-wsgi-server:latest
    environment:
      - APP_DOMAIN=chagpt.com:9000
```

## Client Configuration

| Parameter             | Description                                 | Default Value              |
|-----------------------|---------------------------------------------|----------------------------|
| SERVER_DOMAIN         | Server Address                              | http://backend-web-server |
| DEFAULT_LOCALE         | Default Language                           | en                        |
| NUXT_PUBLIC_APP_NAME  | Application Name                            | ChatGPT UI                 |
| NUXT_PUBLIC_TYPEWRITER| Enable Typewriter Effect [true/false]       | true                       |
| NUXT_PUBLIC_TYPEWRITER_DELAY | Typewriter Effect Delay in milliseconds | 50                         |

## User Registration Control

After deployment, there is an `open_registration` setting under `Chat->Settings` in the admin panel to control whether user registration is allowed. The default value is `True` (allowing user registration). If not needed, please change it to `False`.

## Web Search Function Control

This feature is disabled by default. You can enable it in the admin panel under `Chat->Settings`. There is a setting called `open_web_search`, set its value to `True`.

## Frugal Mode Control

This feature is enabled by default. You can disable it in the `Chat->Settings` section of the management backend. There is a setting called `open_frugal_mode_control` in Settings. Set its value to `False`.