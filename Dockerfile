FROM node:18
ENV NODE_ENV prod

WORKDIR /usr/src/app
ADD package.json /usr/src/app
RUN npm install

ADD . /usr/src/app
RUN npm run build

ADD start.sh /usr/src/app
RUN chmod +x /usr/src/app/start.sh

CMD ["/usr/src/app/start.sh"]
EXPOSE 5003
EXPOSE 5004
