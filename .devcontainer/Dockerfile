FROM mcr.microsoft.com/devcontainers/typescript-node:4-24-trixie
# ARG USERNAME=node

RUN apt-get update && \
    apt-get install -y \
        sqlite3 \
        jq \
        ripgrep \
        fd-find \
        tree \
        zip \
        unzip \
        less \
        && apt-get clean
# USER $USERNAME

ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@latest --activate