import bcrypt from "bcrypt";
import { User } from "../../models/User";
import { RegisterInput, LoginInput } from "./auth.schema";
import { signAccessToken } from "../../utils/jwt";

export const registerUser = async (data: RegisterInput) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error("Email already in use");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(data.password, saltRounds);

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash
  });

  const accessToken = signAccessToken({ userId: user._id.toString(), email: user.email });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    },
    accessToken
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = signAccessToken({ userId: user._id.toString(), email: user.email });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    },
    accessToken
  };
};
