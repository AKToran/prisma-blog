import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPostIntoDB = async (
  payload: ICreatePostPayload,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPostsFromDB = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true,
          activeStatus: true,
          id: true,
          role: true,
        },
      },
      comments: true,
    },
  });

  return posts;
};

const getPostsStats = async () => {};

const getMyPosts = async (userId : string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: userId
    },
    orderBy:{
      createdAt: "desc"
    },
    include:{
      comments: true,
      author: {
        omit: {
          password: true
        },
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  })
  return result;
};

const getPostById = async (postId: string) => {
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    include: {
      author: {
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true,
          role: true,
        },
      },
      comments: true,
    },
  });

  return post;
};

const updatePostInDB = async () => {};

const deletePostFromDb = async () => {};

export const postService = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostsStats,
  getPostById,
  getMyPosts,
  updatePostInDB,
  deletePostFromDb,
};
