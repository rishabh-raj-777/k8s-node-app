FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm init -y
RUN npm install express

EXPOSE 3000

CMD [ "node", "server.js" ]