# 配置参考

## 数据库

后端默认使用内置的 Sqlite 来存储数据，如果不连接外部数据库，数据将在容器销毁后丢失。

`chatgpt-ui-wsgi-server` 镜像提供环境变量 `DB_URL` 来配置与外部数据库的连接，以下是 `DB_URL` 的链接格式对照表。

| 数据库                | 链接                                             |
|----------------------|--------------------------------------------------|
| PostgreSQL           | postgres://USER:PASSWORD@HOST:PORT/DATABASE_NAME |
| MySQL                | mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME    |
| SQLite               | sqlite:///PATH                                   |

例如我使用 PostgreSQL，则配置如下：

```
backend-wsgi-server:
    image: wongsaang/chatgpt-ui-wsgi-server:latest
    environment:
      - DB_URL=postgres://postgres:postgrespw@localhost:49153/chatgpt
```

## 邮箱验证

如果你开放用户注册功能，并需要向用户发送邮箱激活链接，需要在 `wsgi-server` 服务中配置以下环境变量：

| 参数                  | 说明                                             | 默认值 |
|----------------------|--------------------------------------------------|-----|
| ACCOUNT_EMAIL_VERIFICATION | 邮箱验证方式，可选值： none, optional, mandatory | optional |
| EMAIL_HOST                 | SMTP 服务器地址    |  smtp.mailgun.org    |
| EMAIL_PORT                 | SMTP 服务器端口号  |   587       |
| EMAIL_HOST_USER            | 用户名             |    -         |
| EMAIL_HOST_PASSWORD        | 密码              |     -     |
| EMAIL_USE_TLS              | 是否加密           |   True       |
| EMAIL_FROM                 | 发件邮箱            |     webmaster@localhost  |

## API 代理

如果您的网络无法请求 OpenAI 的 API 地址，您可以在 `wsgi-server` 服务中配置代理，如何搭建代理服务，需要您自行搜索。

例如：

```
backend-wsgi-server:
    image: wongsaang/chatgpt-ui-wsgi-server:latest
    environment:
      - OPENAI_API_PROXY=https://openai.proxy.com/v1 # 注意，域名后面需要带上 v1
```

## 后端 CSRF 白名单

如果你在访问管理后台的时候遇到 `CSRF verification failed`，可能你的 `APP_DOMAIN` 没有配置对。在 `wsgi-server` 服务下有个环境变量 `wsgi-server`。 它的值应该是 `backend-web-server` 的地址+端口, 默认： `localhost:9000`。

假如我把 `chagpt.com` 这个域名解析到了服务器，并且我的 `backend-web-server` 服务绑定了 9000 这个端口。正确的配置如下：

```
backend-wsgi-server:
    image: wongsaang/chatgpt-ui-wsgi-server:latest
    environment:
      - APP_DOMAIN=chagpt.com:9000
```

## 客户端配置

| 参数                  | 说明                                      | 默认值                    |
|----------------------|-------------------------------------------|---------------------------|
| SERVER_DOMAIN                     | 服务端地址                    | http://backend-web-server |
| DEFAULT_LOCALE                    | 默认语言                      | en                        |
| NUXT_PUBLIC_APP_NAME              | 应用名称                      |  ChatGPT UI               |
| NUXT_PUBLIC_TYPEWRITER            | 是否开启 打字机 效果[true/false]|  true                    |
| NUXT_PUBLIC_TYPEWRITER_DELAY      | 打字机效果的延迟时间，单位：毫秒|  50                       |


## 用户注册控制

部署完整后，在管理后台的 `Chat->Setting` 下面有 `open_registration` 设置项，用于控制是否开放用户注册。默认是 `True` (允许用户注册)，如果不需要，请改成 `False`。

## 网页搜索功能控制

该功能默认处于关闭状态，你可以在管理后台的 `Chat->Settings` 中开启它，在 Settings 中有一个 `open_web_search` 的设置项，把它的值设置为 `True`。

## 节俭模式控制

该功能默认处于开启状态，你可以在管理后台的 `Chat->Settings` 中关闭它，在 Settings 中有一个 `open_frugal_mode_control` 的设置项，把它的值设置为 `False`。