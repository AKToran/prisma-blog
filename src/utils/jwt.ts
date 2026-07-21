import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

const verifyToken = (token: string, secret: string) =>{
  try {
    const verifiedToken =  jwt.verify(token, secret);
    return verifiedToken;
  } catch (error: any) { 
    throw new Error(error.message);
  }
}

export const jwtUtils = {
  createToken,
  verifyToken,
};