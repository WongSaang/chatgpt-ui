import{_ as s,M as r,p as o,q as d,R as n,t as e,N as t,a1 as a}from"./framework-5866ffd3.js";const l={},c=a(`<h1 id="quick-start" tabindex="-1"><a class="header-anchor" href="#quick-start" aria-hidden="true">#</a> Quick Start</h1><p>This project provides related docker images for deployment on a VPS or your local computer. Please note that if your network is unable to request the OpenAI API address, you need to configure a proxy. If you want to make it available to other users, it&#39;s best to have a domain name and resolve it to the server.</p><p>You also need an OpenAI API Key, and there are multiple ways to obtain it online, please search for it yourself.</p><h2 id="deploying" tabindex="-1"><a class="header-anchor" href="#deploying" aria-hidden="true">#</a> Deploying</h2><h3 id="quickly-deploy-script" tabindex="-1"><a class="header-anchor" href="#quickly-deploy-script" aria-hidden="true">#</a> Quickly deploy script</h3><p><strong>Note: This script has only been verified on Ubuntu Server 22.04 LTS.</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>bash &lt;(curl -Ls https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/deployment.sh)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="docker-compose" tabindex="-1"><a class="header-anchor" href="#docker-compose" aria-hidden="true">#</a> Docker Compose</h3><h4 id="prepare-docker-compose-yml" tabindex="-1"><a class="header-anchor" href="#prepare-docker-compose-yml" aria-hidden="true">#</a> Prepare docker-compose.yml</h4>`,9),u=n("code",null,"docker-compose.yml",-1),m={href:"/en/guide/configuration",target:"_blank",rel:"noopener noreferrer"},v=n("p",null,[e("You can download the "),n("code",null,"docker-compose.yml"),e(" template to your local machine or server by clicking on the link below:")],-1),h={href:"https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/docker-compose.yml",target:"_blank",rel:"noopener noreferrer"},p=a(`<p>You can also manually create the <code>docker-compose.yml</code> file and copy the following content into the file:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>version: &#39;3&#39;
services:
  client:
    platform: linux/x86_64
    image: wongsaang/chatgpt-ui-client:latest
    environment:
      - SERVER_DOMAIN=http://backend-web-server
      - DEFAULT_LOCALE=en
#      - NUXT_PUBLIC_APP_NAME=&#39;ChatGPT UI&#39; # The name of the application
#      - NUXT_PUBLIC_TYPEWRITER=true # Whether to enable the typewriter effect, default false
#      - NUXT_PUBLIC_TYPEWRITER_DELAY=50 # The delay time of the typewriter effect, default 50ms
    depends_on:
      - backend-web-server
    ports:
      - &#39;\${CLIENT_PORT:-80}:80&#39;
    networks:
      - chatgpt_ui_network
    restart: always
  backend-wsgi-server:
    platform: linux/x86_64
    image: wongsaang/chatgpt-ui-wsgi-server:latest
    environment:
      - APP_DOMAIN=\${APP_DOMAIN:-localhost:9000}
      - SERVER_WORKERS=3 # The number of worker processes for handling requests.
      #      - DB_URL=postgres://postgres:postgrespw@localhost:49153/chatgpt # If this parameter is not set, the built-in Sqlite will be used by default. It should be noted that if you do not connect to an external database, the data will be lost after the container is destroyed.
      - DJANGO_SUPERUSER_USERNAME=admin # default superuser name
      - DJANGO_SUPERUSER_PASSWORD=password # default superuser password
      - DJANGO_SUPERUSER_EMAIL=admin@example.com # default superuser email
      - ACCOUNT_EMAIL_VERIFICATION=\${ACCOUNT_EMAIL_VERIFICATION:-none} # Determines the e-mail verification method during signup – choose one of &quot;none&quot;, &quot;optional&quot;, or &quot;mandatory&quot;. Default is &quot;optional&quot;. If you don&#39;t need to verify the email, you can set it to &quot;none&quot;.
      # If you want to use the email verification function, you need to configure the following parameters
#      - EMAIL_HOST=SMTP server address
#      - EMAIL_PORT=SMTP server port
#      - EMAIL_HOST_USER=
#      - EMAIL_HOST_PASSWORD=
#      - EMAIL_USE_TLS=True
#      - EMAIL_FROM=no-reply@example.com  #Default sender email address
    ports:
      - &#39;\${WSGI_PORT:-8000}:8000&#39;
    networks:
      - chatgpt_ui_network
    restart: always
  backend-web-server:
    platform: linux/x86_64
    image: wongsaang/chatgpt-ui-web-server:latest
    environment:
      - BACKEND_URL=http://backend-wsgi-server:8000
    ports:
      - &#39;\${SERVER_PORT:-9000}:80&#39;
    depends_on:
      - backend-wsgi-server
    networks:
      - chatgpt_ui_network
    restart: always

networks:
  chatgpt_ui_network:
    driver: bridge
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="starting-the-service" tabindex="-1"><a class="header-anchor" href="#starting-the-service" aria-hidden="true">#</a> Starting the Service</h4><p>After modifying the configuration as needed, you can start the service by running the following command:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker-compose up --pull always -d
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This command is used to start the services specified in the Docker Compose configuration. The specific meanings of the parameters are as follows:</p><ul><li><code>up</code>: start the services specified in the Docker Compose configuration.</li><li><code>--pull always</code>: before starting the service each time, the latest version of the image will be pulled from the Docker image repository. This ensures that the image used is always up to date.</li><li><code>-d</code>: run the service in the background. If this parameter is not added, the service will run in the current terminal window until the user manually stops it.</li></ul><h2 id="after-deployment" tabindex="-1"><a class="header-anchor" href="#after-deployment" aria-hidden="true">#</a> After Deployment</h2><p>Access the management panel at <code>http(s)://your.domain:9000/admin</code> or <code>http(s)://123.123.123.123:9000/admin</code> using the default superuser account:</p><ul><li>username: <strong>admin</strong></li><li>password: <strong>password</strong></li></ul><p><s>Before starting a chat, you need to add an OpenAI API key. In the management panel, in the &quot;Settings&quot; section, there is a record named <code>openai_api_key</code>. Set the value to your API key.</s></p><p>In the latest version, a separate API Key management has been added to the admin panel, located under &quot;Provider/Api keys&quot;. You can add multiple API Keys here, and the backend program will track the usage of each key&#39;s token and balance the usage based on token usage. <strong>To enable this feature, you need to delete the previous &quot;openai_api_key&quot; setting.</strong></p><p>Now you can access the client at <code>http(s)://your.domain</code> or <code>http://123.123.123.123</code> to start chatting.</p><p>🎉🎉🎉 Have fun!</p>`,14);function b(g,f){const i=r("ExternalLinkIcon");return o(),d("div",null,[c,n("p",null,[e("The project provides a sample "),u,e(". If you want to customize the configuration, please refer to the "),n("a",m,[e("configuration reference"),t(i)]),e(" section.")]),v,n("p",null,[n("a",h,[e("https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/docker-compose.yml"),t(i)])]),p])}const y=s(l,[["render",b],["__file","quick-start.html.vue"]]);export{y as default};
