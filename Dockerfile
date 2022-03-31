FROM node:16.14
RUN apt update
RUN apt install -y openjdk-11-jre-headless

RUN mkdir -p /usr/src/f5apiaprilchallenge
WORKDIR /usr/src/f5apiaprilchallenge
COPY . /usr/src/f5apiaprilchallenge

RUN npm install
RUN npm run build

ENV NODE_ENV docker

CMD ["npm", "run", "start"]
