FROM osgeo/gdal:ubuntu-full-3.0.2 

RUN apt-get update && \
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_11.x  | bash -
RUN apt-get -y install nodejs
RUN npm i -g ndjson-cli@0.3.1

RUN node -v
RUN npm -v
RUN ndjson-cat -V

ENTRYPOINT ["ls ."]
