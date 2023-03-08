<p align="center">
  <img alt="demo" src="./demos/demo.png?v=1">
</p>

[English](./README.md) | [中文](./docs/zh/README.md)

# ChatGPT UI

ChatGPT Web 客户端，支持多用户，支持 Mysql、PostgreSQL 等多种数据库连接进行数据持久化存储，支持多语言。提供 Docker 镜像和快速部署脚本。

## 📢 更新

<details open>
<summary><strong>2023-03-04</strong></summary>

**使用最新的官方聊天模型**  `gpt-3.5-turbo`

**🎉🎉🎉 提供一个 shell 脚本，用于快速部署到服务器** [使用方法](#one-click-depolyment)

</details>

<details open>

<summary><strong>2023-02-24</strong></summary>
V2 是一个重要的更新，将后端功能分离为一个独立的项目，托管在 [chatgpt-ui-server](https://github.com/WongSaang/chatgpt-ui-server), 该项目使用基于 Python 的 Django 框架。 

如果您仍然希望使用旧版本，请访问 [v1 branch](https://github.com/WongSaang/chatgpt-ui/tree/v1) （不推荐，不再更新）.

</details>

## V2 的功能特性:

- 😉 前后端分离，后端使用基于 Python 的 Django 框架。
- 😘 用户身份验证，支持多个用户。
- 😀 能够将数据存储在外部数据库中，支持 Mysql、PostgreSQL 等数据库（默认为 Sqlite）。
- 😎 持续对话，让AI根据上下文回答问题。


## 🚀 一行命令部署到服务器 <a name="one-click-depolyment"></a>

注意：此脚本仅在 Ubuntu Server 22.04 LTS 上验证过。

```bash
bash <(curl -Ls https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/deployment.sh)
```

> 如果您拥有一个域名，可以使用 DNS 解析将其指向服务器的 IP 地址。当然，直接使用服务器的 IP 地址也是可以的。
> 在脚本执行期间，会提示您输入域名。如果您没有域名，可以直接输入服务器的 IP 地址。

### 部署完成之后

访问 `http(s)://your.domain:9000/admin` / IP `http(s)://123.123.123.123:9000/admin` 登录管理面板。

默认超级用户: `admin`

默认密码: `password`

在可以开始聊天之前，您需要添加一个 OpenAI 的 API 密钥。在管理面板的设置模型中，添加一个名称为 openai_api_key 的记录，将值设置为您的 API 密钥。

现在可以访问客户端地址 `http(s)://your.domain` / `http://123.123.123.123` 开始聊天。

🎉🎉🎉 享受吧！

## 通过 Docker Compose 快速开始

以下是一个 docker-compose.yml 模板，您可以使用它来快速启动服务。

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
      - APP_DOMAIN=${APP_DOMAIN:-localhost:9000} # CSRF 白名单，在这里设置为 chatgpt-ui-web-server 的地址+端口, 默认： localhost:9000
      #- DB_URL=postgres://postgres:postgrespw@localhost:49153/chatgpt # 连接外部数据库，如果不设置这个参数，则默认使用内置的 Sqlite。需要注意的是，如果不连接外部数据库，数据将在容器销毁后丢失。链接格式请看下面的 DB_URL 格式对照表
      #- OPENAI_API_PROXY=https://openai.proxy.com/v1 # https://api.openai.com/v1 的代理地址
      - DJANGO_SUPERUSER_USERNAME=admin # 默认超级用户
      - DJANGO_SUPERUSER_PASSWORD=password # 默认超级用户的密码
      - DJANGO_SUPERUSER_EMAIL=admin@example.com # 默认超级用户邮箱
      # 如果您想使用电子邮件验证功能，需要配置以下参数：
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

### DB_URL 格式对照表

| 数据库                | 链接                                              |
|----------------------|--------------------------------------------------|
| PostgreSQL           | ``postgres://USER:PASSWORD@HOST:PORT/NAME``      |
| MySQL                | ``mysql://USER:PASSWORD@HOST:PORT/NAME``         |
| SQLite               | ``sqlite:///PATH``                               |

### 设置 API 密钥

访问 `http(s)://your.domain:9000/admin` / IP `http(s)://123.123.123.123:9000/admin` 登录管理面板。

默认超级用户: `admin`

默认密码: `password`

在可以开始聊天之前，您需要添加一个 OpenAI 的 API 密钥。在管理面板的设置模型中，添加一个名称为 openai_api_key 的记录，将值设置为您的 API 密钥。

现在可以访问客户端地址 `http(s)://your.domain` / `http://123.123.123.123` 开始聊天。


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