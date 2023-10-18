FROM node:18-alpine

WORKDIR /server

ENV PATH /server/node_modules/.bin:$PATH

COPY ./package*.json /.
COPY ./ ./
RUN npm --version
RUN npm install

CMD ["node", "dist/server.js"]






