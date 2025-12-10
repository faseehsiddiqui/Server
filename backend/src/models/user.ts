import mongoose, { Document, Schema } from "mongoose";

// 1. Create a TypeScript interface for User
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: string; // optional, e.g., "user" or "admin"
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Create Mongoose schema
const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name must be less than 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

// 3. Create and export the model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
