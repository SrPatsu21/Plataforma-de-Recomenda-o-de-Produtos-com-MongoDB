# get from repository
FROM mongo
FROM node as base

# name of the folder that docker will work with this app
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends

# copy to know what need to be install
COPY ./package.json .

# install dependencies
RUN npm install --dev

EXPOSE 3000