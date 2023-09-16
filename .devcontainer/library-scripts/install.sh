#!/bin/bash

DOCKER_VERSION=23.0.1
DOCKER_BUILDX_VERSION=0.10.3

## install docker cli
wget https://download.docker.com/linux/static/stable/x86_64/docker-$DOCKER_VERSION.tgz -P /tmp/
tar xzvf /tmp/docker-$DOCKER_VERSION.tgz -C /tmp/
install /tmp/docker/docker /usr/bin/

## install docker buildx
wget https://github.com/docker/buildx/releases/download/v$DOCKER_BUILDX_VERSION/buildx-v$DOCKER_BUILDX_VERSION.linux-amd64 -O /tmp/docker-buildx
mkdir -p /usr/lib/docker/cli-plugins/
install /tmp/docker-buildx /usr/lib/docker/cli-plugins/

## Clean up
rm -rf /tmp/docker*

REQUESTS_CA_BUNDLE="/etc/ssl/certs/ca-certificates.crt",
NODE_EXTRA_CA_CERTS="/etc/ssl/certs/ca-certificates.crt"
npm config set strict-ssl=false
yarn config set strict-ssl false
# npx playwright install
# npx playwright install-deps