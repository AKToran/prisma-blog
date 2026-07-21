import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

export const jwtUtils = {
  createToken,
};