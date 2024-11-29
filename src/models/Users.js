const mongoose = require("mongoose");
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
            description:
                "must be a string, at least 8 characters, and is required",
        },
        isAdmin: {
            type: Boolean,
            default: false, // Default is non-admin user
            description: "Indicates if the user is an admin",
        },
        active: {
            type: Boolean,
            default: true, // Default is active user
            description: "Indicates if the user account is active",
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

const Users = mongoose.model("Users", userSchema);

//* update by post
const updateUser = async (req, res, next) => {
    const { username, email } = req.body;
    try {
        const user = await Users.findByIdAndUpdate(
            req.user._id,
            {
                username,
                email
            },
            {
                new: true,
                runValidators: true,
                overwrite: true,
            }
        );
        req.user = user;
        next();
    } catch (error) {
        console.error("Error creating product:", error);
        next(error);
    }
};


//* search
const searchUsers = async (req, res, next) => {
  try {
    const { username } = req.query;
    const limit = req.limit || 50;
    const query = {};
    if (username) {
        query.username = { $regex: username, $options: 'i' }; // Case-insensitive search
    }
    // query.isAdmin = false;
    const users = await Users.find(query).limit(limit);
    req.users = users;
    next()
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try{
    const user = await Users.findByIdAndUpdate(req.params.id,
      {active:false, updatedAt:null}
      ,
      { new: true, runValidators: true, overwrite: true }
    );
    req.user = user;
    next()
  }
  catch (error) {
    console.error(error);
    next(error);
  }
};
// Export the model
module.exports = {
  Users: Users,
  searchUsers: searchUsers,
  deleteUser: deleteUser,
  updateUser: updateUser,
}
