const { z } = require("zod");

exports.getUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
exports.reigsterUser = async (req, res) => {
  const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  try {
    const validatedData = userSchema.parse(req.body);

    // If the validation is successful, proceed with your logic
    // For example, save the user to the database
    console.log("User data is valid:", validatedData);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
  }
};
