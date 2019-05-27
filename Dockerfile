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

# Switch to maps directory
RUN mkdir maps
WORKDIR ./maps

# Copy map data
# COPY ./maps/altis ./
# COPY ./maps/bootcamp_acr ./
# COPY ./maps/chernarus ./
COPY ./maps/chernarus_summer ./
COPY ./maps/chernarus_winter ./
# COPY ./maps/desert_e ./
# COPY ./maps/gm_weferlingen_summer ./
# COPY ./maps/intro ./
# COPY ./maps/lythium ./
# COPY ./maps/malden ./
# COPY ./maps/mountains_acr ./
# COPY ./maps/porto ./
# COPY ./maps/prei_khmaoch_luong ./
COPY ./maps/provinggrounds_pmc ./
# COPY ./maps/ruha ./
# COPY ./maps/sara ./
# COPY ./maps/saralite ./
# COPY ./maps/shapur_baf ./
# COPY ./maps/stratis ./
# COPY ./maps/takistan ./
# COPY ./maps/tanoa ./
# COPY ./maps/tem_anizay ./
# COPY ./maps/tembelan ./
# COPY ./maps/utes ./
# COPY ./maps/vr ./
# COPY ./maps/wl_rosche ./
# COPY ./maps/woodland_acr ./
# COPY ./maps/zargabad ./

WORKDIR ..

EXPOSE 80

ENTRYPOINT [ "npm", "start" ]
