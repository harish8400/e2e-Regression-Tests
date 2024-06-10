# FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# # COPY ./ /e2e/

# WORKDIR .

# VOLUME /playwright-report

# # RUN npm install

# # RUN npx playwright install

# # ENTRYPOINT [ "npx", "playwright", "test" ]
# # CMD []

FROM python:bullseye

RUN groupadd --gid 1000 pn && useradd --uid 1000 --gid pn --shell /bin/bash --create-home pn
# Install node prereqs & nodejs
# Ref: https://deb.nodesource.com/setup_18.x
RUN \
  apt-get update && \
  apt-get install -y ca-certificates curl gnupg && \
  mkdir -p /etc/apt/keyrings && \
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key |  gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
  NODE_MAJOR=18 && \
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
  apt-get update && \
  apt-get upgrade -yqq && \
  apt-get install -yqq nodejs less jq && \
  npm i -g npm tslint-to-eslint-config typescript snyk aws-cdk && \
  rm -rf /var/lib/apt/lists/*

RUN pip install cfn-lint

# Install AWS CLI
RUN	\
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install

# Install playwright browser dependencies
RUN	\
  apt-get update && \
  apt-get install -y libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libatspi2.0-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libxkbcommon0 libasound2

