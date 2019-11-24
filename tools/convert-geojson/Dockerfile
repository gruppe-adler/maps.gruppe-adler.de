FROM node:10

RUN npm i -g ndjson-cli

WORKDIR /root

RUN mkdir /tools
RUN mkdir /output
RUN mkdir /input

COPY ./armaToLonLat.js /tools
COPY ./entrypoint.sh /tools
COPY ./layer_settings.json /tools

ENTRYPOINT [ "/tools/entrypoint.sh" ]
