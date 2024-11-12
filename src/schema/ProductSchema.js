class ProductSchema {
  constructor() {
    // Define the schema properties
    this.fields = {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "price", "category"],
          properties: {
            _id: {
              bsonType: "objectId",
              unique: true,
              description: "must be an ObjectId and is required"
            },
            name: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            category: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            tags:
            {
              bsonType: "array",
              items: {
                bsonType: "string"
              },
              description: "must be an array of strings"
            },
            price: {
              bsonType: "decimal",
              minimum: 0,
              pattern: "^[0-9]+(\\.[0-9]{2})?$",
              description: "must be a positive decimal and is required"
            },
            rating: {
              bsonType: "double",
              minimum: 0,
              maximum: 5,
              description: "must be a number between 0 and 5 with up to one decimal place",
              pattern: "^[1-5](\\.[0-9])?$"
            }
          }
        }
      }
    }
  }
}

module.exports = mongoose.model("Product", Products);