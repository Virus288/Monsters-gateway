FROM node:18
ENV NODE_ENV prod

WORKDIR /usr/src/app
ADD package.json /usr/src/app
RUN npm install --omit=dev

ADD build /usr/src/app/build

CMD [ "node", "./build/src/main.js" ]
EXPOSE 5003
EXPOSE 5004
