FROM mcr.microsoft.com/devcontainers/base:ubuntu

ARG USERNAME=node

RUN apt-get update && \
    apt-get install -y \
        build-essential \
        curl \
        wget \
        unzip \
        jq \
        ripgrep \
        fd-find \
        sqlite3 \
        ca-certificates \
        && apt-get clean

USER $USERNAME

ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@latest --activate