const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    _id: {
      type: "objectId",
      auto: true,
      // unique: true, // MongoDB automatically ensures this
      description: "must be an ObjectId and is required",
    },
    username: {
      type: "string",
      required: true,
      trim: true,
      description: "must be a string and is required",
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
      description: "must be a valid email and is required",
    },
    password: {
      type: "string",
      required: true,
      minlength: 8,
      description: "must be a string, at least 8 characters, and is required",
    },
    lastSearched: {
      words: {
        type: [String], // Array of strings for words
        default: [], // Defaults to an empty array
        validate: {
          validator: function (v) {
            return v.length <= 10; // Maximum 10 items
          },
          message: () => `Cannot store more than 10 words!`,
        },
      },
      categories: {
        type: [String], // Array of strings for categories
        default: [],
        validate: {
          validator: function (v) {
            return v.length <= 10; // Maximum 10 items
          },
          message: () => `Cannot store more than 10 categories!`,
        },
      },
      tags: {
        type: [String], // Array of strings for tags
        default: [],
        validate: {
          validator: function (v) {
            return v.length <= 10; // Maximum 10 items
          },
          message: () => `Cannot store more than 10 tags!`,
        },
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model('Users', userSchema);

// Export the model
module.exports = User;
