const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Users } = require('./Users')

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
  try {
    const newProduct = new Products({
        name,
        img_id,
        category,
        tags: tags ? tags.split(',').map(cat => cat.trim()) : [],
        price,
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
const searchProducts = async (req, res, next) => {
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
const searchProductsActive = async (req, res, next) => {
  try {
    const { name, tag, category } = req.query;
    const limit = req.limit || 50;
    const query = {};
    query.active = true;
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

const saveForUserRecomendation = async (req, res, next) => {
  try {
    if(req.products && req.user && req.query){
      const { name, tag, category } = req.query;
      const user = req.user;
      if (name) {
        user.lastSearched.words.unshift(name);
        if (user.lastSearched.words.length > 10) {
            user.lastSearched.words = user.lastSearched.words.slice(0, 10);
        }
      }
      if (tag) {
        user.lastSearched.tags.unshift(tag);
        if (user.lastSearched.tags.length > 10) {
            user.lastSearched.tags = user.lastSearched.tags.slice(0, 10);
        }
      }
      if (category) {
        user.lastSearched.categories.unshift(category);
        if (user.lastSearched.categories.length > 10) {
            user.lastSearched.categories = user.lastSearched.categories.slice(0, 10);
        }
      }
      const user_updated = await Users.findByIdAndUpdate(
        req.user._id,
        {lastSearched: user.lastSearched},
        { new: true, runValidators: true, overwrite: true }
      )
      console.log(user_updated)
    }
    next()
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//* recomendation
const recomendateProduct = async (req, res, next) => {
  try {
    if(req.user && !(req.query.name || req.query.tag || req.query.category))
    {
      const user = req.user;
      const words = user.lastSearched.words;
      const tags = user.lastSearched.tags
      const categories = user.lastSearched.categories
      const limit = req.limit_recomendation || 8;
      const products = await Products.find({
          active: true,
          $or: [
            { name: { $in: words } },
            { category: { $in: categories } },
            { tags: { $in: tags } },
          ],
        }).sort({ timesPurchased: -1 })
        .limit(limit);
      req.recomendate_products = products;
    }
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
  let active = false;
  if (req.body.active == "on"){
    active = true
  }
  try {
    const product = await Products.findByIdAndUpdate(req.body.id,
      {
        name,
        img_id,
        category,
        tags,
        price,
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
    searchProduct: searchProducts,
    getProductById: getProductById,
    deleteProduct: deleteProduct,
    updateProduct: updateProduct,
    recomendateProduct: recomendateProduct,
    searchProductsActive: searchProductsActive,
    saveForUserRecomendation: saveForUserRecomendation,
  };