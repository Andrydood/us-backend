FROM node:12

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 4000

CMD [ "yarn", "start"]
