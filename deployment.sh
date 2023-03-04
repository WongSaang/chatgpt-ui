#!/bin/bash

read -p "Please enter a resolved domain name: " domain

export APP_DOMAIN="${domain}:9000"

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

sudo curl -L "https://raw.githubusercontent.com/WongSaang/chatgpt-ui/main/docker-compose.yml" -o docker-compose.yml

echo "Starting services..."

sudo docker-compose up -d

echo "Done"