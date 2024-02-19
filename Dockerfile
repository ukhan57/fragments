# This is the ./Dockerfile
# This file will used to dockerize our fragment/node.js server
# There will also be instructions for me to remember what and how everything works

# Every file begins with a FROM instruction that specifies the parent image to use as a starting point of our own image.
# Our fragments server image will be based on Docker images which will help us to avoide duplicating our work accross projects
# FROM node

# Saying that we want to use node would work. However, this doesn't specify a particular version of node. We do that by adding a :tag, for example: node:18 or node:lts
# Use node version 18.13.0
# FROM node:18.13.0

# According to the locally installed node, my version is v20.11.0
FROM node:20.11.0

# After your FROM instruction, leave a blank line then define some metadata about your image.
# The LABEL instruction adds key=value pairs with arbitrary metadata about your image. For example, you can indicate who is maintaining this image (you are, so use your name/email), and what this image is for.
LABEL maintainer="Umar Khan <ukhan57@myseneca.ca>"
LABEL description="Fragments node.js microserver"

# Leave another blank like, then define any environment variables you want to include.
# We define environment variables using the ENV instruction, which also uses key=value pairs like LABEL.
# Environment variables become part of the built image, and will persist in any containers run using this image. We'll provide default values, but they can be overridden at runtime using the --env, -e or --env-file flags.

# NOTE: we haven't included some environment variables that don't make sense in a Dockerfile.
# For example, we don't want to include secrets, nor do we want to define things that will always be different.
# These we can define at run-time instead of build-time. Our Amazon Cognito variables are a good example of something that we can't put in the Dockerfile, since they will always be different.

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Leave another blank like, then define and create our app's working directory.
# The base images we use (e.g., node) will already define a filesystem for us (i.e., a Linux distro with node.js installed).
# However, we need to create a directory for our application. This can be named and located whatever you want in the existing filesystem. A logical place might be /app: an app directory in the root:
# This will create the /app directory, since it won't exist, and then enter it (i.e., cd /app), so that all subsequent commands will be relative to /app. You can use the WORKDIR instruction as many times as you need to in your Dockerfile.

# Use /app as our working directory
WORKDIR /app

# Leave another blank line, then copy your application's package.json and package-lock.json files into the image.
# Our project depends on many dependencies (defined in package.json) and these dependencies also have dependencies at a specific version (defined in package-lock.json).
# We use the COPY instruction to copy files and folders into our image. In its most basic form, we use COPY <src> <dest>.
# This copies from the build context (i.e. our <src>) to a path inside the image (i.e., our <dest>).
# The build context includes all of the files and directories in and below the path where docker build is run. This will typically be in the same directory as the Dockerfile.
# The syntax for how we define the <src> and <dest> in a COPY instruction can differ. 

# Option 1: explicit path - Copy the package.json and package-lock.json
# files into /app. NOTE: the trailing `/` on `/app/`, which tells Docker
# that `app` is a directory and not a file.
# COPY package*.json /app/

# Option 2: relative path - Copy the package.json and package-lock.json
# files into the working dir (/app).  NOTE: this requires that we have
# already set our WORKDIR in a previous step.
# COPY package*.json ./

# Option 3: explicit filenames - Copy the package.json and package-lock.json
# files into the working dir (/app), using full paths and multiple source
# files.  All of the files will be copied into the working dir `./app`
COPY package.json package-lock.json ./

# Leave another blank line, then we need to install our dependencies.
# We use the RUN instruction to execute a command and cache this layer (i.e., we can reuse it later if package.json/package-lock.json haven't changed):

# Install node dependencies defined in package-lock.json
RUN npm install

# Leave another blank line, then copy your server's source code into the image.
# All of our code is conveniently located in a src/ directory, and we need to end up with our code at /app/src. We can do that with:

# Copy src to /app/src/
COPY ./src ./src

# To include our HTPASSWD file were referencing in our environment variables in our test/.htpasswd
# to run our container using basic-auth method instead of using cognito

# Copy src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Our final step is to define the command to run in order to start our container.
# A Docker container is really a single process, and we need to tell Docker how to start this process. In our case, we can do that with the command npm start.

# Start the container by running our server
CMD npm start

# NOTE: one final instruction that many server containers include is EXPOSE. We use EXPOSE in order to indicate the port(s) that a container will listen on when run.
# For example, a web server might EXPOSE 80, indicating that port 80 is the typical port used by this container.

# We run our service on port 8080
EXPOSE 5555

# After every update to this file, we will have to re-build our image in docker
