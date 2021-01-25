FROM node:lts-alpine

RUN apk update \
  && apk upgrade \
  && apk add python3 g++

# expose port from container
EXPOSE 3000

# setting working directory for code
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# copy source code into the image, except paths in .dockerignore
COPY . .

# starts application
CMD ["npm", "run", "start"]
