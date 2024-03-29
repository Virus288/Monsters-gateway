FROM node:18
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}

WORKDIR /usr/src/app
ADD package.json /usr/src/app
RUN npm install

ADD build /usr/src/app/build
ADD public /usr/src/app/build/public

ADD start.sh /usr/src/app
RUN chmod +x /usr/src/app/start.sh

CMD ["/usr/src/app/start.sh"]
EXPOSE 5003
EXPOSE 5004
