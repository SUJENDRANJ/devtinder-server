const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 40,
    },

    lastName: {
      type: String,
      minLength: 1,
      maxLength: 40,
    },

    emailId: {
      type: String,

      validate(val) {
        if (!validator.isEmail(val))
          throw new Error(`Invalid email address: ${val}`);
      },
      //   validate: {
      //     validator: validator.isEmail,
      //     message: "Invalid email format",
      //   },
      required: true,
      trim: true,
      lowercase: true,
      unique: true, //* or
      // index : true - easy for db operations
    },

    password: {
      type: String,
      required: true,

      validate(val) {
        if (!validator.isStrongPassword(val))
          throw new Error("Enter a Strong Password: " + val);
      },
    },

    age: {
      type: Number,

      validate(val) {
        if (val < 16) throw new Error("Come after you are 16"); //* this overrides min (validator) / runs first
      },

      min: 16,
    },

    gender: {
      type: String,
      //   validate(val) {
      //     if (val !== "male" || val !== "female" || val !== "others")
      //       throw new Error(`${val} is not a valid gender type`);
      //   },
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not valid gender type",
      },
    },

    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm0gw1Qon8aQmHbrqQD4Z1-LKICaMGlp1HXA&s",
      validate: {
        validator: validator.isURL, // another method
      },
    },

    about: { type: String, default: "This is a default about of the user!" },

    skills: [String],
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  // const salt = bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const currentUser = this;
  const passwordHash = currentUser.password;
  return await bcrypt.compare(passwordInputByUser, passwordHash);
};

const User = model("User", userSchema);

module.exports = User;
