# Build sprites
FROM node:12.7-alpine as sprite-builder
RUN echo ::group::BUILD SPRITES
WORKDIR /tmp/sprites
COPY sprites .
RUN npm ci
RUN npm run build
RUN npm start
RUN mv ./out /out
RUN echo ::endgroup::

# Build styles
FROM node:12.7-alpine as style-builder
RUN echo ::group::BUILD STYLES
WORKDIR /tmp/styles
COPY styles .
RUN npm ci
RUN npm run build
RUN npm start
RUN mv ./out /out
RUN echo ::endgroup::

# Build frontend
FROM node:12.7-alpine AS frontend-builder
RUN echo ::group::BUILD FRONTEND
WORKDIR /tmp/frontend
COPY frontend .
RUN npm ci
ENV NODE_ENV production
RUN npm run build
RUN mv ./dist /out
RUN echo ::endgroup::

# Build tools
FROM golang:1.15.3-alpine AS tools-builder
RUN echo ::group::BUILD TOOLS
WORKDIR /tmp/tools
RUN mkdir -p /out
COPY tools/buildJSON/go-util .
RUN go build -o /out/go-util ./main.go
COPY --from=style-builder /out/layers.json /out
COPY tools/buildJSON/config.json tools/buildJSON/buildJSONs.sh /out/
RUN chmod a+rwx /out/*
RUN echo ::endgroup::

######################################################################

FROM nginx:stable-alpine

# Build Tiles
WORKDIR /tmp/tiles
COPY maps maps
COPY tools/buildTiles .
RUN ./buildTiles.sh ./maps /srv/www/maps

# Build JSONs
WORKDIR /tmp/jsons
COPY --from=tools-builder /out .
RUN ./buildJSONs.sh /srv/www/maps

RUN rm -rf /tmp/*

RUN sed -i '1idaemon off;' /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /srv/www

COPY --from=sprite-builder /out sprites
COPY --from=frontend-builder /out frontend

EXPOSE 80
CMD ["nginx"]