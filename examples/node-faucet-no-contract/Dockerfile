FROM node:13

RUN mkdir -p /usr/src/faucet

WORKDIR /usr/src/faucet

COPY package.json /usr/src/faucet

RUN npm i

ARG invalidate=0
COPY ./public /usr/src/faucet/public
COPY ./src /usr/src/faucet/src
COPY ./config.js /usr/src/faucet
COPY ./cleandb.js /usr/src/faucet

EXPOSE 3000

CMD ["npm", "start"]