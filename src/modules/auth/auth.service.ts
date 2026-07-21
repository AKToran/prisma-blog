import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";

const loginUserService = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findFirstOrThrow({
    where: { email }
  });

  const matchPassword = await bcrypt.compare(password, user.password);

  if(!matchPassword){
    throw new Error ("Password is incorrect.");
  }

  return user;
};

export const authService = {
  loginUserService,
};
