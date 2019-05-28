FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# clone git repo
# yes this is bad practice but the copy stuff takes way to fucking long (4+ hours)
RUN apk add --no-cache git
RUN git clone https://github.com/gruppe-adler/maps.gruppe-adler.de.git
# RUN git clone --recurse-submodules https://github.com/gruppe-adler/maps.gruppe-adler.de.git

# remove all the unnecessary stuff
RUN find . ! -name 'maps' -exec rm -f {} + 

# bundle app source
COPY . .

EXPOSE 80

ENTRYPOINT [ "npm", "start" ]
