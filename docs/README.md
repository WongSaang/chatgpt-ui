
# Introduction

ChatGPT UI is an unofficial ChatGPT web client. It supports multiple users, multiple languages, and multiple database connections for persistent data storage, such as Mysql, PostgreSQL, and Sqlite.

This project consists of two parts, the client-side and the server-side:

- Client-side, based on [Nuxt](https://nuxt.com/), project address: [https://github.com/WongSaang/chatgpt-ui](https://github.com/WongSaang/chatgpt-ui)
- Server-side, based on [Django](https://djangoproject.com/), project address: [https://github.com/WongSaang/chatgpt-ui-server](https://github.com/WongSaang/chatgpt-ui-server)


## Features

### Client-side
- User system, supporting user registration, login, password modification, and more.
- Multi-language user interface, supporting multiple languages.
- Persistent data storage, supporting Mysql, PostgreSQL, and Sqlite databases.
- Asynchronous conversation, supporting multiple conversations simultaneously.
- Management of historical conversations.
- Continuous chat, allowing ChatGPT clients to answer questions based on their historical chat records, resulting in better answers.
- Web search capability, allowing ChatGPT to retrieve the latest information.
- Convenient tools, supporting one-click message and code block copying, as well as message editing.
- Common command management, allowing users to store and edit their own common commands.
- PWA, supporting installation to the desktop.
- User Token Usage Statistics.
- Supports configuring multiple API Keys.

### Server-side
- The server-side has an administrative panel.
- User management.
- Conversation and message management.
- Common configurations.


## Original Intention

Since using ChatGPT, it has become a good helper in work. Unfortunately, as we all know, it cannot be accessed in some places. But fortunately, OpenAI has opened up its API, so I started to write a user interface for myself.

> Nothing is difficult if you put your heart into it.

Later, several friends asked me how to use ChatGPT because they didn't have the technical skills. So I started to develop a multi-user system, which can not only be used by myself but also help my family and friends around me.

After the project was open-sourced, many people raised issues and some even submitted PRs, and the project has developed to its current state. I also learned a lot during this process, as I have always believed that helping others is also helping oneself.