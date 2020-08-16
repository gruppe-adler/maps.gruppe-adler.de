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

# Build sprites
RUN echo ::group::BUILD SPRITES

WORKDIR /tmp/sprites
COPY sprites .
RUN npm ci
RUN npm run build

RUN echo ::endgroup::

# Move to app directory
WORKDIR /usr/src/app

# copy static assets
COPY package*.json ./
COPY src/ ./src

# install dependencies
RUN npm ci --only=production

# copy frontend to app dir 
RUN mv /tmp/frontend/dist ./preview

# copy sprites to app dir 
RUN mv /tmp/sprites/out ./sprites

# cleanup 
RUN rm -rf /tmp/*

EXPOSE 80
ENTRYPOINT [ "npm", "start" ]
