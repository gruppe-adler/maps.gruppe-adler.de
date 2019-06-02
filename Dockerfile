FROM node:10-alpine

# Build frontend
WORKDIR /tmp/
COPY frontend .

RUN npm ci
ENV BASE_URL=/preview/
RUN npm run build

# Create app directory
WORKDIR /usr/src/app

# Move frontend dist 
RUN mv /tmp/dist ./preview

# clone git repo
# yes this is bad practice but the copy stuff takes way too fucking long (4+ hours)
# RUN apk add --no-cache git
# RUN git clone https://github.com/gruppe-adler/maps.gruppe-adler.de.git .
# RUN git clone --recurse-submodules https://github.com/gruppe-adler/maps.gruppe-adler.de.git .

# remove all the unnecessary stuff
# RUN find . ! -name 'maps' -exec rm -ir {} \;

# bundle app source
COPY . .

# install depencies
RUN npm ci

EXPOSE 80

ENTRYPOINT [ "npm", "start" ]
