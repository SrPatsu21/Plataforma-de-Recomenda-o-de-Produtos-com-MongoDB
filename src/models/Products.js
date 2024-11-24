const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    _id: {
      type: "objectId",
      auto: true,
      // unique: true, // no need, MongoDB automatically ensures that
      description: "must be an ObjectId and is required",
    },
    name: {
      type: "string",
      required: true,
      trim: true,
      description: "must be a string and is required",
    },
    img_id: {
      type: "string",
      required: true,
      default: "0",
      trim: true,
      description: "must be a string and is required",
    },
    category: {
      type: "string",
      required: true,
      trim: true,
      description: "must be a string and is required",
    },
    tags:
    {
      type: [String], // Array of strings
      default: [], // Optional; defaults to an empty array if not provided
    },
    price: {
      type: mongoose.Types.Decimal128, // For decimal precision
      required: true,
      min: 0, // Enforces price must be >= 0
      validate: {
        validator: function(v) {
          return /^[0-9]+(\.[0-9]{2})?$/.test(v.toString()); // Ensures two decimal places
        },
        message: props => `${props.value} is not a valid price!`
      },
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5, // Rating must be between 0 and 5
      validate: {
        validator: function(v) {
          return /^[0-5](\.[0-9])?$/.test(v.toString()); // Allows 1 decimal place
        },
        message: props => `${props.value} is not a valid rating!`,
      },
    },
    timesPurchased: {
      type: Number,
      default: 0,
      min: 0, // Enforces non-negative values
      description: "Tracks how many times the product has been purchased",
    },
    active: {
      type: Boolean,
      default: true, // Default is active user
      description: "Indicates if the user account is active",
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
)

const Products = mongoose.model('Products', productSchema);

//* create
const createProduct = async (req, res, next) => {
  const { name, category, tags, price} = req.body;
  const img_id = req.img_id
  const active = true
  const rating = 0;
  try {
    const newProduct = new Products({
        name,
        img_id,
        category,
        tags,
        price,
        rating,
        active
    });
    await newProduct.save();
    // This will be available in the next middleware
    req.product = newProduct;
    next();
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
};
//* search
const searchProduct = async (req, res, next) => {
  try {
    const { name, tag, category } = req.query;
    const limit = req.limit || 50;
    const query = {};
    if (name) {
        query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }
    if (tag) {
        query.tags = { $in: [tag] }; // Tag must be in the product's tags array
    }
    if (category) {
        query.category = { $regex: category, $options: 'i' }; // Case-insensitive search
    }
    const products = await Products.find(query).limit(limit);
    req.products = products; // Return the list of matching products
    next()
  } catch (error) {
    console.error(error);
    next(error);
  }
};
//* get by id
// if (!product) {
//   return res.status(404).json({ error: "Product not found" });
// }
const getProductById = async (req, res, next) => {
  try{
    const product = await Products.findById(req.params.id);
    req.product = product;
    next()
  }
  catch (error) {
    console.error(error);
    next(error);
  }
}

//* delete
const deleteProduct = async (req, res, next) => {
  try{
    const product = await Products.findByIdAndUpdate(req.params.id,
      {active:false, updatedAt:null}
      ,
      { new: true, runValidators: true, overwrite: true }
    );
    req.product = product;
    next()
  }
  catch (error) {
    console.error(error);
    next(error);
  }
}
//* update by post
const updateProduct = async (req, res, next) => {
  const { name, category, tags, price} = req.body;
  const img_id = req.img_id
  const active = true
  const rating = 0;
  try {
    const product = await Products.findByIdAndUpdate(req.body.id,
      {
        name,
        img_id,
        category,
        tags,
        price,
        rating,
        active
      },
      { new: true, runValidators: true, overwrite: true }
    );
    // This will be available in the next middleware
    req.product = product;
    next();
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
};

// Export the model
module.exports = {
    Products: Products,
    createProduct: createProduct,
    searchProduct: searchProduct,
    getProductById: getProductById,
    deleteProduct: deleteProduct,
    updateProduct: updateProduct,
  };