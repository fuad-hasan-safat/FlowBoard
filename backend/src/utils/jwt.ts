import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtUserPayload {
  userId: string;
  email: string;
}

export const signAccessToken = (payload: JwtUserPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn
  };

  return jwt.sign(payload, env.jwtAccessSecret, options);
};

export const verifyAccessToken = (token: string): JwtUserPayload => {
  return jwt.verify(token, env.jwtAccessSecret) as JwtUserPayload;
};
