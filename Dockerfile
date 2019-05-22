FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install node_modules
RUN npm ci

# Bundle app source
COPY ./error.png ./
COPY ./index.js ./

# Copy map data
COPY ./maps/ ./maps/

EXPOSE 80

ENTRYPOINT [ "npm", "start" ]
