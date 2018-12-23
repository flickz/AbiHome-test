FROM node:alpine
LABEL maintainer="omoyajowo2015@gmail.com"

ENV WORKDIR=/usr/src/app
RUN mkdir -p ${WORKDIR}
WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}
RUN npm install
COPY . ${WORKDIR}

EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]