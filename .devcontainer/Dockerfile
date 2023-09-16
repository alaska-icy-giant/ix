FROM mcr.microsoft.com/devcontainers/typescript-node:18

RUN  wget -qO- -Yoff http://pki.micron.com/pki/Micron%20Technology%20Root%20CA.crt | openssl x509 -out /usr/local/share/ca-certificates/Micron_Root_CA.crt && \
wget -qO- -Yoff http://pki.micron.com/pki/Micron%20Technology%20Issuing%20CA.crt | openssl x509 -out /usr/local/share/ca-certificates/Micron_Issuing_CA.crt && \
update-ca-certificates

RUN apt-get update && apt-get install -y vim bash-completion && apt-get clean -y && rm -rf /var/lib/apt/lists/*

COPY library-scripts/*.sh /tmp/library-scripts/

RUN bash /tmp/library-scripts/install.sh

RUN rm -rf /tmp/library-scripts
