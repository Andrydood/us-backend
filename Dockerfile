FROM node:12.11
EXPOSE 4000 

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install packages
RUN yarn

# Bundle app source
COPY . .

# Build DB
CMD [ "yarn", "dev" ]
