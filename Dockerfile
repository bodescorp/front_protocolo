FROM node:14
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
COPY ./src/services/api.prod.js /app/src/services/api.js
CMD npm start
EXPOSE 3000