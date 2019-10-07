FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy maps
COPY ./maps/altis ./maps/altis
COPY ./maps/bootcamp_acr ./maps/bootcamp_acr
COPY ./maps/chernarus ./maps/chernarus
COPY ./maps/chernarus_summer ./maps/chernarus_summer
COPY ./maps/chernarus_winter ./maps/chernarus_winter
COPY ./maps/desert_e ./maps/desert_e
COPY ./maps/enoch ./maps/enoch
COPY ./maps/gm_weferlingen_summer ./maps/gm_weferlingen_summer
COPY ./maps/gm_weferlingen_winter ./maps/gm_weferlingen_winter
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
COPY ./maps/tem_cham ./maps/tem_cham
COPY ./maps/tembelan ./maps/tembelan
COPY ./maps/utes ./maps/utes
COPY ./maps/vr ./maps/vr
COPY ./maps/wake ./maps/wake
COPY ./maps/wl_rosche ./maps/wl_rosche
COPY ./maps/woodland_acr ./maps/woodland_acr
COPY ./maps/zargabad ./maps/zargabad

# Build frontend
WORKDIR /tmp/
COPY frontend .

RUN npm ci
ENV BASE_URL=/preview/
RUN npm run build

# Move to app directory
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

# Bundle app source

COPY package*.json ./

COPY ./error.png ./
COPY ./index.js ./

# install depencies
RUN npm ci

EXPOSE 80

ENTRYPOINT [ "npm", "start" ]
