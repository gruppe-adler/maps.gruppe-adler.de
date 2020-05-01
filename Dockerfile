FROM node:10-slim

WORKDIR /tmp
COPY maps maps
COPY tools tools

# build everything
RUN ./tools/entrypoint.sh ./maps /usr/src/app/maps

# Build frontend
RUN echo ::group::BUILD FRONTEND

WORKDIR /tmp/frontend
COPY frontend .
RUN npm ci
ENV BASE_URL=/preview/
RUN npm run build

RUN echo ::endgroup::

# Move to app directory
WORKDIR /usr/src/app

# copy static assets
COPY package*.json ./
COPY error.png ./
COPY index.js ./
COPY mapsRouter.js ./
COPY icons icons

# install dependencies
RUN npm ci --only=production

# copy frontend to app dir 
RUN mv /tmp/frontend/dist ./preview

# cleanup 
RUN rm -rf /tmp/*

EXPOSE 80
ENTRYPOINT [ "npm", "start" ]
