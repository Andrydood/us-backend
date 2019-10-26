FROM node:10
EXPOSE 4000 9229

# Create app directory
# WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install


# Bundle app source
COPY . .




# Build DB
CMD [ "cd", "src"]
CMD [ "npm", "run", "dev" ]
