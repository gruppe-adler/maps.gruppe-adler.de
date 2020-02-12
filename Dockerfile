######################################################################
######################### tippecanoe-builder #########################

FROM ubuntu:16.04 AS tippecanoe-builder

WORKDIR /tmp

# Update repos and install dependencies
RUN apt update \
  && apt -y upgrade \
  && apt -y install build-essential libsqlite3-dev zlib1g-dev

RUN apt update && apt install git build-essential -y
RUN git --version
RUN git clone --depth 1 https://github.com/mapbox/tippecanoe.git tippecanoe-src

WORKDIR ./tippecanoe-src

# Checkout version 1.34.3
RUN git fetch && git fetch --tags
RUN git checkout 1.35.0

# Build tippecanoe
RUN make
RUN chmod +x ./tippecanoe
RUN ./tippecanoe --version

RUN mkdir -p /out/
RUN mv ./tippecanoe /out/tippecanoe

# This image will containa runnung tippecanoe executable in the /out/ directory

########################## geojson-builder ##########################
FROM osgeo/gdal:ubuntu-full-3.0.2 AS geojson-builder

RUN apt update
RUN apt -y install curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt -y install nodejs
RUN npm i -g ndjson-cli@0.3.1

WORKDIR /usr/build

COPY maps maps
COPY tools/geojson-builder tools

RUN gdalinfo --version
RUN node --version
RUN npm --version
RUN ndjson-cat --version

RUN ./tools/entrypoint.sh ./tools ./maps /out /tmp

# After this the /out directory will contain a directory for each map.
# Those map directories will look like this:
#
# stratis
# ├── [...]
# └── houses.geojson

######################################################################
############################ sat-builder #############################
FROM dpokidov/imagemagick:7.0.8-40 as sat-builder

WORKDIR /usr/build

COPY maps /maps

# TODO: Update tools dir
COPY  tools/sat-builder tools

RUN ./tools/entrypoint.sh /maps /out

# After this the /out directory will contain a directory for each map.
# Those map directories will look like this:
#
# stratis
# │
# ├── [...]
# ├── 2                 # This the LOD
# │   ├── [...]
# │   └── 0             # This a the column
# │       ├── [...]
# │       └── 1.png     # This is the row
# └── sat.json

######################################################################
######################################################################

FROM node:10-slim

# Install sqlite as it is needed for tippecanoe
RUN apt update && apt -y install sqlite3

# Build map tiles
WORKDIR /tmp/geojsons
COPY --from=geojson-builder /out geojson
COPY tools/build-mvts.sh .
COPY --from=tippecanoe-builder /out/tippecanoe .
RUN ./tippecanoe --version
RUN mkdir -p /usr/src/app/maps
RUN ./build-mvts.sh ./tippecanoe ./geojson /usr/src/app/maps

# Build frontend
WORKDIR /tmp/frontend
COPY frontend .
RUN npm ci
ENV BASE_URL=/preview/
RUN npm run build

WORKDIR /tmp/maps
COPY maps .

# copy maps meta.json
RUN find */meta.json -exec /bin/cp {} /usr/src/app/maps/{} \;

# copy maps preview.png
RUN find */preview.png -exec /bin/cp {} /usr/src/app/maps/{} \;

# copy maps sat images
WORKDIR /tmp/sat
COPY --from=sat-builder /out sat
COPY tools/copySatTiles.sh .
RUN ./copySatTiles.sh ./sat /usr/src/app/maps

# Move to app directory
WORKDIR /usr/src/app

# copy static assets
COPY package*.json ./
COPY error.png ./
COPY index.js ./
COPY icons icons


# install dependencies
RUN npm ci

# copy frontend to app dir 
RUN mv /tmp/frontend/dist ./preview

# cleanup 
RUN rm -rf /tmp/*

EXPOSE 80
ENTRYPOINT [ "npm", "start" ]
