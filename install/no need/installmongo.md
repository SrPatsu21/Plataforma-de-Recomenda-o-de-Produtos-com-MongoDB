<!-- tutorial https://www.mongodb.com/docs/manual/installation/  -->

install
```shell
sudo apt install mongodb-org-server

sudo apt-get install gnupg curl

curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

sudo apt-get update

sudo apt-get install -y mongodb-org
```

start
```shell
sudo systemctl start mongod

sudo systemctl is-active mongod.service

sudo systemctl status mongod

sudo systemctl enable mongod
```

entrar na shell do mongo
```shell
mongosh
```

porta padrão: 27017

## mongo shell
display the database
```shell
db
```
switch database or create
```shell
use <databasename>
```
create collections
```shell
db.createCollection("products")
```
insert on collections
```shell
db.products.insertOne(object)
#like this
db.products.insertOne( { x: 1 } );
# u can insert many using insertMany() and passing many json objects
```
find on db
```shell
db.products.find()
#find x=1
db.products.find( {x: 1} )
```
find only one
```shell
db.products.findOne()
```
update files
updateOne() or updateMany()
```shell
#first parameter is to find the collection, the second parameter is for what will be change
db.products.updateOne( { x: 1 }, { $set: { x: 2 } } )
```

delete
deleteOne() or deleteMany()

```shell
# work like a find
db.products.deleteOne( { x: 1 } )
```
more code in <https://www.w3schools.com/mongodb/mongodb_query_operators.php>