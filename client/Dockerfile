FROM node:18-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ./client/package*.json /.
RUN npm install

COPY ./client ./

CMD ["npm", "start"]