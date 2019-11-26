########################## map-data-builder ##########################
FROM osgeo/gdal:ubuntu-full-3.0.2 AS map-data-builder

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get -y install nodejs
RUN npm i -g ndjson-cli@0.3.1

WORKDIR /tmp/

COPY maps .
COPY tools .

RUN gdalinfo --version
RUN node --version
RUN npm --version
RUN ndjson-cat --version

RUN ./tools/build-map-data/entrypoint.sh

######################################################################
######################### tippacanoe-builder #########################

# TODO: Build tippacanoe

######################################################################
######################################################################

FROM node:10-alpine

# Build map tiles
WORKDIR /tmp/map-data
COPY --from=map-data-builder ./map-data .
COPY tools/build-mvts.sh .
# TODO: Copy tippacanoe from tippacanoe-builder
# RUN ./build-mvts.sh ./tippacanoe /usr/src/app/maps

# Build frontend
WORKDIR /tmp/frontned
COPY frontend .
RUN npm ci
ENV BASE_URL=/preview/
RUN npm run build

# Move to app directory
WORKDIR /usr/src/app

# copy static assets
COPY package*.json .
COPY error.png .
COPY index.js .
COPY icons .

# copy maps meta.jsons
COPY maps/*/meta.json .

# install dependencies
RUN npm ci

# copy frontend to app dir 
RUN mv /tmp/frontend/dist ./preview

# cleanup 
RUN rm -rf /tmp/*

EXPOSE 80
ENTRYPOINT [ "npm", "start" ]
