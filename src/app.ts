import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", async (req: Request, res: Response) => {
  // const user = await prisma.user.findMany();
  // console.log(user);
  res.send("Hello world!");
});

app.post("/api/users/register", async (req: Request, res: Response) => {
  const { name, email, password, profilePhoto } = req.body;

  const doesUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (doesUserExist) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto: profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit : {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export default app;
