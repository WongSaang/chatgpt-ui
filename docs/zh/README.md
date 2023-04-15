# 介绍

ChatGPT UI 是一个非官方的 ChatGPT Web 客户端。它支持多用户，多语言，多种数据库连接进行数据持久化存储，例如：Mysql、PostgreSQL 和 Sqlite 等。

本项目项目包括客户端和服务端两部分。

- 客户端，基于 [Nuxt](https://nuxt.com/)，项目地址：[https://github.com/WongSaang/chatgpt-ui](https://github.com/WongSaang/chatgpt-ui)
- 服务端，基于 [Django](https://djangoproject.com/)，项目地址：[https://github.com/WongSaang/chatgpt-ui-server](https://github.com/WongSaang/chatgpt-ui-server)


## 功能与特性

### 客户端
- 用户系统，支持用户注册、登录、修改密码等。
- 用户界面多语言，支持多种语言。
- 数据持久化，支持 Mysql、PostgreSQL 和 Sqlite 等数据库。
- 异步对话，支持多个对话同时进行。
- 历史对话管理。
- 持续聊天，让 ChatGPT 客户历史聊天记录回答问题，得出更好的答案。
- 网页搜索能力，让 ChatGPT 获取最新信息。
- 便捷的工具，支持一键复制消息和代码块，以及重新编辑消息等。
- 常用指令管理，用户可存储和编辑自己的常用指令。
- PWA，支持安装到桌面。
- 用户 Token 使用量统计
- 支持配置多个 API Key

### 服务端
- 服务端拥有一个管理面板
- 用户管理
- 对话和消息管理
- 常用配置


## 初衷

自从使用 ChatGPT ，它已经成为工作中的好帮手。可惜的是，就像大家知道的，它在有些地方无法访问。但好在 OpenAI 开放了 API，于是我开始为自己写用户界面。

> 世上无难事，只怕有心人。

后来，有多位朋友询问我怎么样才能使用 ChatGPT，因为他们没有技术能力。于是我又着手于多用户系统的开发，这样除了自己用，还能帮助到身边的亲朋好友。

项目开源后，有很多人提了 issue，也有人提了 PR，项目就发展到如今的样子。我在这个过程中也学到了很多，正如我一直坚信的，帮助他人也是帮助自己。