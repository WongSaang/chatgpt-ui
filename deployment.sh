#!/bin/bash

read -p "Please enter a domain name or external IP address [default: localhost]: " APP_DOMAIN

if [ -z "$APP_DOMAIN" ]; then
  APP_DOMAIN="localhost"
fi

read -p "Please set a port for the frontend server [default: 80]: " CLIENT_PORT

if [ -z "$CLIENT_PORT" ]; then
  CLIENT_PORT="80"
fi

read -p "Please set a port for the backend server [default: 9000]: " SERVER_PORT

if [ -z "$SERVER_PORT" ]; then
  SERVER_PORT="9000"
fi

read -p "Please set a port for the backend WSGI server [default: 8000]: " WSGI_PORT

if [ -z "$WSGI_PORT" ]; then
  WSGI_PORT="8000"
fi

read -p "If you want to connect to a database, please enter the database URL [default: none]: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
  DATABASE_URL="sqlite:///db.sqlite3"
fi


if [[ $(which docker) ]]; then
    echo "Docker is already installed"
else
    echo "Docker is not installed, installing now..."

    sudo apt-get update

    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    sudo mkdir -m 0755 -p /etc/apt/keyrings

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update

    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi
if [[ $(which docker-compose) ]]; then
    echo "Docker Compose is already installed"
else
    echo "Docker Compose is not installed, installing now..."

    sudo curl -L "https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    sudo chmod +x /usr/local/bin/docker-compose
fi

echo "Downloading configuration files..."

# if docker-compose.yml doesn't exist, download it
if [ ! -f "docker-compose.yml" ]; then
    sudo curl -L "https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/docker-compose.yml" -o docker-compose.yml
fi

echo "Starting services..."

touch ./db_sqlite3/db.sqlite3

sudo APP_DOMAIN="${APP_DOMAIN}:${SERVER_PORT}" CLIENT_PORT=${CLIENT_PORT} SERVER_PORT=${SERVER_PORT} WSGI_PORT=${WSGI_PORT} DB_URL=${DATABASE_URL}  docker-compose up -d

echo "Done"
