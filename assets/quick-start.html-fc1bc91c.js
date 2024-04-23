import{_ as a,M as r,p as o,q as l,R as e,t as n,N as s,a1 as d}from"./framework-5866ffd3.js";const c={},t=d('<h1 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h1><p>本项目提供了相关的 docker 镜像，你需要一个 vps 来部署，当然你也可以在本地的电脑上部署。需要注意的是，如果你的网络无法请求 OpenAI 的 API 地址，您需要配置代理。如果你想开放给其他用户使用，最好还需要一个域名，并将域名解析到服务器。</p><p>您还需要一个 OpenAI 的API Key，网上有获取多种方案，请自行搜索。</p><h2 id="部署" tabindex="-1"><a class="header-anchor" href="#部署" aria-hidden="true">#</a> 部署</h2><h3 id="快速部署脚本" tabindex="-1"><a class="header-anchor" href="#快速部署脚本" aria-hidden="true">#</a> 快速部署脚本</h3>',5),v={href:"https://wongsnotes.com/p/deploying-your-own-chatgpt-client-with-one-line-of-command/",target:"_blank",rel:"noopener noreferrer"},m=d(`<p><strong>注意：此脚本目前仅在 Ubuntu Server 22.04 LTS 上验证过。</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>bash &lt;(curl -Ls https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/deployment.sh)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="docker-compose" tabindex="-1"><a class="header-anchor" href="#docker-compose" aria-hidden="true">#</a> Docker Compose</h3><h4 id="准备-docker-compose-yml" tabindex="-1"><a class="header-anchor" href="#准备-docker-compose-yml" aria-hidden="true">#</a> 准备 docker-compose.yml</h4>`,4),u=e("code",null,"docker-compose.yml",-1),p={href:"/zh/guide/configuration",target:"_blank",rel:"noopener noreferrer"},h=e("p",null,[n("你可以通过下方链接下载 "),e("code",null,"docker-compose.yml"),n(" 模板到本地或服务器：")],-1),b={href:"https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/docker-compose.yml",target:"_blank",rel:"noopener noreferrer"},_=d(`<p>也可以手动创建 <code>docker-compose.yml</code> 文件，然后复制下面的内容到文件中：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>version: &#39;3&#39;
services:
  client:
    image: wongsaang/chatgpt-ui-client:latest
    environment:
      - SERVER_DOMAIN=http://backend-web-server
      - DEFAULT_LOCALE=zh
    #      - NUXT_PUBLIC_APP_NAME=&#39;ChatGPT UI&#39; # APP 名称
    #      - NUXT_PUBLIC_TYPEWRITER=true # 是否开启 打字机 效果
    #      - NUXT_PUBLIC_TYPEWRITER_DELAY=50 # 打字机效果的延迟时间，单位：毫秒，默认：50
    depends_on:
      - backend-web-server
    ports:
      - &#39;80:80&#39;
    networks:
      - chatgpt_ui_network
  backend-wsgi-server:
    image: wongsaang/chatgpt-ui-wsgi-server:latest
    environment:
      - APP_DOMAIN=\${APP_DOMAIN:-localhost:9000} # CSRF 白名单，在这里设置为 chatgpt-ui-web-server 的地址+端口, 默认： localhost:9000
      - SERVER_WORKERS=3 # gunicorn 的工作进程数，默认为 3
      #- DB_URL=postgres://postgres:postgrespw@localhost:49153/chatgpt # 连接外部数据库，如果不设置这个参数，则默认使用内置的 Sqlite。需要注意的是，如果不连接外部数据库，数据将在容器销毁后丢失。链接格式请看下面的 DB_URL 格式对照表
      #- OPENAI_API_PROXY=https://openai.proxy.com/v1 # https://api.openai.com/v1 的代理地址
      - DJANGO_SUPERUSER_USERNAME=admin # 默认超级用户
      - DJANGO_SUPERUSER_PASSWORD=password # 默认超级用户的密码
      - DJANGO_SUPERUSER_EMAIL=admin@example.com # 默认超级用户邮箱
      - ACCOUNT_EMAIL_VERIFICATION=none # 邮箱验证方式，可选值： none, optional, mandatory. 默认为 optional。如果你不需要验证用户的邮箱，可以设置为 none。
      # 如果您想使用电子邮件验证功能，需要配置以下参数：
    #      - EMAIL_HOST=SMTP server address
    #      - EMAIL_PORT=SMTP server port
    #      - EMAIL_HOST_USER=
    #      - EMAIL_HOST_PASSWORD=
    #      - EMAIL_USE_TLS=True
    #      - EMAIL_FROM=no-reply@example.com  #默认发件邮箱地址
    ports:
      - &#39;8000:8000&#39;
    networks:
      - chatgpt_ui_network
  backend-web-server:
    image: wongsaang/chatgpt-ui-web-server:latest
    environment:
      - BACKEND_URL=http://backend-wsgi-server:8000
    ports:
      - &#39;9000:80&#39;
    depends_on:
      - backend-wsgi-server
    networks:
      - chatgpt_ui_network

networks:
  chatgpt_ui_network:
    driver: bridge
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="启动服务" tabindex="-1"><a class="header-anchor" href="#启动服务" aria-hidden="true">#</a> 启动服务</h4><p>你可以自行修改配置后，运行下面的命令来启动服务。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker-compose up --pull always -d
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这个命令用于启动 Docker Compose 配置中的服务。具体的参数含义如下：</p><ul><li><code>up</code>：启动 Docker Compose 配置中的服务。</li><li><code>--pull always</code>：每次启动服务前，都会从 Docker 镜像仓库中拉取最新版本的镜像。这样可以确保使用的镜像始终是最新的。</li><li><code>-d</code>：在后台运行服务。如果不加这个参数，服务会在当前终端窗口中运行，直到用户手动停止服务。</li></ul><h2 id="部署完成之后" tabindex="-1"><a class="header-anchor" href="#部署完成之后" aria-hidden="true">#</a> 部署完成之后</h2><p>访问 <code>http(s)://your.domain:9000/admin</code> 或 IP <code>http(s)://123.123.123.123:9000/admin</code> 登录管理面板。</p><p>默认超级用户: <strong>admin</strong></p><p>默认密码: <strong>password</strong></p><p><s>在可以开始聊天之前，您需要添加一个 OpenAI 的 API 密钥。在管理面板的设置模型中，有一个名称为 <code>openai_api_key</code> 的记录，将值设置为您的 API 密钥。</s></p><p>在最新版本中，管理面板增加了一个独立的 API Key 的管理，位于管理面板的 <code>Provider/ Api keys</code>。你可以在这里添加多个 API Key，后端程序会统计每个 Key 的 token 使用量，并根据 token 使用量来平衡使用 Key。<strong>想要这个功能生效，需要删除之前的<code>openai_api_key</code>设置</strong></p><p>现在可以访问客户端地址 <code>http(s)://your.domain</code> 或 IP <code>http://123.123.123.123</code> 开始聊天。</p><p>🎉🎉🎉 祝开心！</p>`,15);function g(k,A){const i=r("ExternalLinkIcon");return o(),l("div",null,[t,e("p",null,[e("em",null,[n("对于技术知识了解不多的选手，如果你看不懂下面的内容，可以看我之前写的博客文章"),e("a",v,[n("《一行命令部署自己的ChatGPT客户端》"),s(i)])])]),m,e("p",null,[n("项目中提供了一个 "),u,n(" 示例，如果你想自定义配置，请看 "),e("a",p,[n("配置参考"),s(i)]),n(" 部分。")]),h,e("p",null,[e("a",b,[n("https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/docker-compose.yml"),s(i)])]),_])}const I=a(c,[["render",g],["__file","quick-start.html.vue"]]);export{I as default};
