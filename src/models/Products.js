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
    img_url: {
      type: "string",
      required: true,
      default: "https://via.placeholder.com/400",
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

const Product = mongoose.model('Products', productSchema);

// Export the model
module.exports = Product;