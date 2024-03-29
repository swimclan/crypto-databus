FROM node:latest
WORKDIR /opt/node/crypto-databus
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "server.js" ]