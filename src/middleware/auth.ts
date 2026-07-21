import { NextFunction, Request, Response } from "express";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { ActiveStatus, Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";

const auth = (...roles: Role[]) => {
  return catchAsync( async(req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new Error("Forbidden: Please log in first.");
    }

    const { id, name, email, role } = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    ) as JwtPayload;

    if (roles.length && !roles.includes(role)) {
      throw new Error("Forbidden: You do not have permission to access this resource.");
    }

    const user = await prisma.user.findUnique({
      where: { id, name, email, role },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    if(user.activeStatus === ActiveStatus.blocked){
      throw new Error("User is blocked. Please contact support.");
    }

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();
  });
};

export default auth;
