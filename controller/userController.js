const { z } = require("zod");
const User = require("../model/userModel");
const { tryCatch } = require("../utils/tryCatch");
const generateToken = require("../utils/generateToken");

exports.getUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
exports.reigsterUser = tryCatch(async (req, res) => {
  const userSchema = z.object({
    firstName: z
      .string()
      .nonempty("first Name is required")
      .max(30, "firstName must be less than or equal to 30 characters")
      .min(2, "firstName must be more than 2 characters"),
    lastName: z
      .string()
      .nonempty("last Name is required")
      .max(30, "lastName must be less than or equal to 30 characters")
      .min(2, "lastName must be more than 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  });

  const { firstName, middleName, lastName, email, password, confirmPassword } =
    req.body;

  const validatedData = userSchema.parse(req.body);
  //   console.log("User data is valid:", validatedData);

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("user already exist!!");
  }

  const user = await User.create(validatedData);

  res.status(200).json({ message: "User registered successfully", user });
});

exports.loginUser = tryCatch(async (req, res) => {
  const loginSchema = z.object({
    email: z.string().email("Invalid Email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const validateData = loginSchema.parse(req.body);

  const { email, password } = validateData;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid Email or Password !!");
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    res.status(400);
    throw new Error("Invalid Email or Password !!");
  }

  const tokenInfo = {
    userId: user._id,
    email: user.email,
  };

  generateToken(res, tokenInfo);

  res.status(200).json({
    message: "user login successfully",
    userInfo: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
});
