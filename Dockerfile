FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install node_modules
RUN npm ci

# Bundle app source
COPY ./error.png ./
COPY ./index.js ./

# Copy map data
# COPY ./maps/altis ./maps/altis
COPY ./maps/bootcamp_acr ./maps/bootcamp_acr
COPY ./maps/chernarus ./maps/chernarus
COPY ./maps/chernarus_summer ./maps/chernarus_summer
COPY ./maps/chernarus_winter ./maps/chernarus_winter
COPY ./maps/desert_e ./maps/desert_e
# COPY ./maps/gm_weferlingen_summer ./maps/gm_weferlingen_summer
COPY ./maps/intro ./maps/intro
COPY ./maps/lythium ./maps/lythium
COPY ./maps/malden ./maps/malden
COPY ./maps/mountains_acr ./maps/mountains_acr
COPY ./maps/porto ./maps/porto
COPY ./maps/prei_khmaoch_luong ./maps/prei_khmaoch_luong
COPY ./maps/provinggrounds_pmc ./maps/provinggrounds_pmc
COPY ./maps/ruha ./maps/ruha
COPY ./maps/sara ./maps/sara
COPY ./maps/saralite ./maps/saralite
COPY ./maps/shapur_baf ./maps/shapur_baf
COPY ./maps/stratis ./maps/stratis
COPY ./maps/takistan ./maps/takistan
COPY ./maps/tanoa ./maps/tanoa
COPY ./maps/tem_anizay ./maps/tem_anizay
COPY ./maps/tembelan ./maps/tembelan
COPY ./maps/utes ./maps/utes
COPY ./maps/vr ./maps/vr
COPY ./maps/wl_rosche ./maps/wl_rosche
COPY ./maps/woodland_acr ./maps/woodland_acr
COPY ./maps/zargabad ./maps/zargabad

EXPOSE 80

ENTRYPOINT [ "npm", "start" ]
