import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User"; // Adjust the path to your User model

// Signup Controller
export const signup = async (req: any, res: any) => {
  try {
    const { name, email, address, password, type } = req.body;

    // Validate required fields
    if (!name || !email || !address || !password || !type) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      address,
      password: hashedPassword,
      type,
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Login Controller
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Respond with success message
    res
      .status(200)
      .json({
        message: "Login successful.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          type: user.type,
        },
      });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
