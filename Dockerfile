# This is a docker file

# Stage 0 ------------------------------------------------------------------------> The build image__
FROM node:20.11.0@sha256:7bf4a586b423aac858176b3f683e35f08575c84500fbcfd1d433ad8568972ec6 as build

LABEL maintainer="Umar Khan <ukhan57@myseneca.ca>"
LABEL description="Fragments node.js microserver"

# node.js tooling for prodution
ENV NODE_ENV=production

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

# explicit filenames - Copy the package.json and package-lock.json
# files into the working dir (/app), using full paths and multiple source
# files.  All of the files will be copied into the working dir `./app`
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production


# Stage 1 ------------------------------------------------------------------------> The production image__
FROM node:20.11.0@sha256:7bf4a586b423aac858176b3f683e35f08575c84500fbcfd1d433ad8568972ec6 as production

WORKDIR /app

COPY --chown=node:node --from=build /app /app

# Copy src to /app/src/
COPY --chown=node:node ./src /app/src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd /app/tests/.htpasswd

# Changing the privelage to least
USER node

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080
