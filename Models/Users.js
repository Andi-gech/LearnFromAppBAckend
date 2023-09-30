const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const UserSchema = mongoose.Schema({
  Firstname: {
    type: String,
    required: true,
    min: 3,
  },
  Lastname: {
    type: String,
    required: true,
    min: 3,
  },
  Email: {
    type: String,
    required: true,
    min: 3,
    unique: true,
  },
  ProfilePic: {
    type: String,
    min: 3,
  },
  Password: {
    type: String,
    required: true,
    min: 3,
  },
  PhoneNo: {
    type: String,
    min: 10,
    max: 10,
  },
  Role: {
    type: String,
    default: "Student",
    enum: ["Admin", "Teacher", "Student"],
  },
});

UserSchema.methods.generateAuthtoken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      Role: this.Role,
      Firstname: this.Firstname,
      Lastname: this.Lastname,
      Email: this.Email,
    },
    "this is key"
  );
  return token;
};
const User = mongoose.model("Users", UserSchema);
const Schema = Joi.object({
  Firstname: Joi.string().required().min(3).max(15),
  Lastname: Joi.string().required().min(3).max(15),
  Email: Joi.string().email().required(),
  Password: Joi.string()
    .min(6)
    .pattern(
      new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\"<>,.?/\\\\]{6,30}$")
    )
    .required(),
  PhoneNo: Joi.string()
    .trim()
    .regex(/^\+?\d{10,}$/)

    .messages({
      "string.pattern.base":
        "Invalid phone number format. Please provide a valid phone number.",
    }),
  Role: Joi.string().valid("Admin", "Teacher", "Student"),
});
const AuthSchema = Joi.object({
  Email: Joi.string().email().required(),
  Password: Joi.string()
    .min(6)
    .pattern(
      new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\"<>,.?/\\\\]{6,30}$")
    )
    .required(),
});
function Validateuser(body) {
  return Schema.validate(body);
}
function ValidateAuth(body) {
  return AuthSchema.validate(body);
}
module.exports.Validateuser = Validateuser;
module.exports.User = User;
module.exports.ValidateAuth = ValidateAuth;
