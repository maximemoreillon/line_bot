FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 8087
CMD [ "node", "linebot.js" ]
