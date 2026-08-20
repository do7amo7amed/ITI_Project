//src/models/userModel.js
// Mongoose schema, hashes password with bcrypt

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    university: {
      type: String,
      required: [true, "University is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    academicLevel: {
      type: Number,
      required: [true, "Academic level is required"],
      min: 1,
      max: 4,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    profileInformation: {
      bio: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

//prevents rehashing password if unnecesasry changes done
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  //extra randomness so identical passwords don't produce identical hashes
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compares login password with stored hashed pass
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
