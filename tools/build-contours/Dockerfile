FROM osgeo/gdal:ubuntu-full-latest

WORKDIR /root

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_11.x  | bash -
RUN apt-get -y install nodejs

RUN npm i -g ndjson-cli

RUN mkdir /tools

COPY ./entrypoint.sh /tools

ENTRYPOINT [ "/tools/entrypoint.sh" ]
