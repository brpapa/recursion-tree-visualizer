# This file defines how the docker image is built
# Each command is a new layer in the image
# RUN - executed during the building of the image
# CMD - executed when running the image in a container

# `base` stage:
FROM node:lts-alpine AS base
# install dependencies
RUN apk update \
  && apk upgrade \
  && apk add python3 g++
# expose port from container
EXPOSE 3030
# working directory where the next commands will be executed
WORKDIR /app
# as it's defined in an previous image layer the dependencies will be reinstalled only if package.json change, thanks to caching
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# `dev` stage: (it needs of bind mount to access code on host OS)
FROM base AS dev
ENV NODE_ENV=development
ENV NODE_PORT=3030
CMD ["npm", "run", "dev:ts"] 

# `prod` stage:
FROM base AS prod
ENV NODE_ENV=production
ENV NODE_PORT=3030
# copy source code into the image, except files in .dockerignore
COPY . .
# TODO: CMD [ "app.lambdaHandler" ]
CMD ["npm", "run", "start"]
