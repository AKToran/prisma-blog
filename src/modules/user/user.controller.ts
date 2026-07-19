import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.registerUserInDB(req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to register user.",
      error: (error as Error).message,
    });
  }
};

export const userController = {
  registerUser,
};
