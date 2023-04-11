# 开发指南

## 前端

所需技能：[Vue](https://vuejs.org/)、[Nuxt](https://nuxt.com/)

项目地址：[https://github.com/WongSaang/chatgpt-ui](https://github.com/WongSaang/chatgpt-ui)

### 环境准备
安装最新稳定版 node.js，如果需要打包成 docker 镜像，还需要安装 docker。

### 安装依赖

```
yarn install
```

### 启动开发服务

```
yarn dev
```

### 构建

```
yarn build
```

### 打包成 docker 镜像

```
docker build -t image-name:latest .
```


## 后端

所需技能：[Python](https://www.python.org/)、[Django](https://djangoproject.com/)

项目地址：[https://github.com/WongSaang/chatgpt-ui-server](https://github.com/WongSaang/chatgpt-ui-server)

### 环境准备
安装Python、pip/pipenv，如果需要打包成 docker 镜像，还需要安装 docker。

### 安装依赖

```
pip install -r requirements.txt
```

### 启动开发服务

```
python manage.py runserver
```

### 打包成 docker 镜像

```
docker build -t image-name:latest .
```