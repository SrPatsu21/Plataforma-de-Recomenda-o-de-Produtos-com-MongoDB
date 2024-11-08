FROM mongo

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

ENTRYPOINT ["nodemon", "src/app.js"]