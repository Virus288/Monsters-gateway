FROM node:18
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}

WORKDIR /usr/src/app
ADD build /usr/src/app/build
ADD package-lock.json /usr/src/app
ADD package.json /usr/src/app
ADD public /usr/src/app/public
ADD start.sh /usr/src/app

RUN npm ci

RUN chmod +x /usr/src/app/start.sh

CMD ["/usr/src/app/start.sh"]
EXPOSE 5003
EXPOSE 5004
