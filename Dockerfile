# get from repository
FROM mongo
FROM node as base

# name of the folder that docker will work with this app
WORKDIR /app

# copy to know what need to be install
COPY ./package.json .

# install dependencies
RUN npm install --dev

# copy everything to workdir
COPY . /app

# run the js script
CMD npm run dev