import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { ActiveStatus } from "../../../generated/prisma/client";
import { JwtPayload } from "jsonwebtoken";

const loginUserService = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Password is incorrect.");
  }

  if (user.activeStatus === ActiveStatus.blocked) {
    throw new Error("User is blocked. Please contact support.");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiration,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expiration,
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  const { id } = verifiedRefreshToken as JwtPayload;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  });

  if (user.activeStatus === "blocked") {
    throw new Error("User is blocked. Contact support.");
  }

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiration,
  );

  return accessToken;
};

export const authService = {
  loginUserService,
  refreshToken,
};
