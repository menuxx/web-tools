FROM keymetrics/pm2-docker-alpine:6

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.9

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

CMD ["pm2-docker", "process.yml", "--only", "MenuxxTools"]

EXPOSE 8071
EXPOSE 8072