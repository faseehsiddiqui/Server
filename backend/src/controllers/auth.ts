import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Sign Up (Register)
export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser: IUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Sign In (Login)
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user: any = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // -------------------------------
    // 1️⃣ Create Access Token (Short Life)
    // -------------------------------
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" } // 1 hour
    );

    // -------------------------------
    // 2️⃣ Create Refresh Token (Long Life)
    // -------------------------------
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" } // 7 days
    );

    // Save refresh token in user DB (optional but secure)
    user.refreshToken = refreshToken;
    await user.save();

    // Send Refresh Token as HTTP Only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, refreshToken: __, ...userData } = user.toObject();

    // Response
    return res.status(200).json({
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      user: userData,
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh Access Token
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    // Verify refresh token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    );

    // Check user & token in DB
    const user: any = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ accessToken });

  } catch (error: any) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
