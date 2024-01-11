FROM node:18
ENV NODE_ENV prod

WORKDIR /usr/src/app
ADD package.json /usr/src/app
RUN npm ci

ADD . /usr/src/app
RUN npm run build

RUN npm run migrate:latest

CMD [ "node", "./build/src/main.js" ]
EXPOSE 5003
EXPOSE 5004
